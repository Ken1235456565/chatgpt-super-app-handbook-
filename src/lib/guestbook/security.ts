import type { APIContext, AstroCookies } from 'astro';
import bcrypt from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';
import { config, GuestbookError, isDev } from './config';

// ---- Request helpers -------------------------------------------------------

export function clientIp(context: Pick<APIContext, 'clientAddress' | 'request'>): string {
  try {
    return context.clientAddress;
  } catch {
    return context.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  }
}

/** Keyed hash so stored rate-limit keys cannot be reversed into IP addresses. */
export async function hashIp(ip: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', config.sessionSecret(), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ]);
  const digest = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ip));
  return Buffer.from(digest).toString('base64url');
}

/** Rejects cross-site requests to mutating endpoints. */
export function assertSameOrigin({ request, url }: Pick<APIContext, 'request' | 'url'>) {
  const origin = request.headers.get('origin');
  if (origin !== url.origin) throw new GuestbookError(403, 'Cross-site request rejected.');
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export function errorResponse(error: unknown): Response {
  if (error instanceof GuestbookError) return json({ error: error.message }, error.status);
  console.error('[guestbook] unexpected error', error);
  return json({ error: 'Something went wrong. Please try again later.' }, 500);
}

// ---- Bot check -------------------------------------------------------------

export async function verifyTurnstile(token: unknown, ip: string): Promise<void> {
  if (typeof token !== 'string' || !token) throw new GuestbookError(400, 'Please complete the human check.');

  const form = new FormData();
  form.set('secret', config.turnstileSecretKey());
  form.set('response', token);
  form.set('remoteip', ip);

  let success = false;
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
    });
    success = ((await response.json()) as { success?: boolean }).success === true;
  } catch (error) {
    console.error('[guestbook] Turnstile verification failed', error);
    throw new GuestbookError(503, 'The human check is unavailable. Please try again later.');
  }
  if (!success) throw new GuestbookError(400, 'The human check failed. Please try again.');
}

// ---- Login throttling (per function instance) --------------------------------

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 5;
const loginAttempts = new Map<string, number[]>();

export function throttleLogin(key: string) {
  const now = Date.now();
  const recent = (loginAttempts.get(key) ?? []).filter((time) => now - time < LOGIN_WINDOW_MS);
  if (recent.length >= LOGIN_MAX_ATTEMPTS) {
    throw new GuestbookError(429, 'Too many sign-in attempts. Please wait 15 minutes.');
  }
  recent.push(now);
  loginAttempts.set(key, recent);
}

// ---- Administrator session ---------------------------------------------------

const COOKIE = 'gb_admin';
const SESSION_HOURS = 8;

export async function checkPassword(password: unknown): Promise<boolean> {
  if (typeof password !== 'string' || !password) return false;
  return bcrypt.compare(password, config.adminPasswordHash());
}

export async function startSession(cookies: AstroCookies) {
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(config.sessionSecret());
  cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: !isDev,
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export function endSession(cookies: AstroCookies) {
  cookies.delete(COOKIE, { path: '/' });
}

export async function isAdmin(cookies: AstroCookies): Promise<boolean> {
  const token = cookies.get(COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, config.sessionSecret(), { algorithms: ['HS256'] });
    return payload.role === 'admin';
  } catch {
    return false;
  }
}
