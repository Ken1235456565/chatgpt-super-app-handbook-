import {
  ADMIN_PASSWORD_HASH,
  OPENAI_API_KEY,
  OPENAI_TRANSLATE_MODEL,
  SESSION_SECRET,
  SUPABASE_SECRET_KEY,
  SUPABASE_URL,
  TURNSTILE_SECRET_KEY,
} from 'astro:env/server';
import { PUBLIC_TURNSTILE_SITE_KEY } from 'astro:env/client';

export const isDev = import.meta.env.DEV;

export const LIMITS = {
  nameLength: 40,
  bodyLength: 2000,
  perMinute: 1,
  perDay: 10,
} as const;

// Cloudflare's published Turnstile test keys; they always pass. Development only.
const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA';
const TURNSTILE_TEST_SECRET_KEY = '1x0000000000000000000000000000000AA';

export class GuestbookError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

function required(name: string, value: string | undefined): string {
  if (value) return value;
  throw new GuestbookError(503, `The guestbook is not configured (${name} is missing).`);
}

export const config = {
  supabase: SUPABASE_URL && SUPABASE_SECRET_KEY ? { url: SUPABASE_URL, key: SUPABASE_SECRET_KEY } : null,
  openai: OPENAI_API_KEY ? { apiKey: OPENAI_API_KEY, model: OPENAI_TRANSLATE_MODEL } : null,
  turnstileSiteKey: PUBLIC_TURNSTILE_SITE_KEY ?? (isDev ? TURNSTILE_TEST_SITE_KEY : undefined),
  turnstileSecretKey: () => TURNSTILE_SECRET_KEY ?? (isDev ? TURNSTILE_TEST_SECRET_KEY : required('TURNSTILE_SECRET_KEY', undefined)),
  adminPasswordHash: () => required('ADMIN_PASSWORD_HASH', ADMIN_PASSWORD_HASH),
  sessionSecret: () => {
    const secret = required('SESSION_SECRET', SESSION_SECRET);
    if (secret.length < 32) throw new GuestbookError(503, 'SESSION_SECRET must be at least 32 characters.');
    return new TextEncoder().encode(secret);
  },
};

/** External services may be replaced by local fallbacks only in development. */
export function assertProductionServices() {
  if (isDev) return;
  required('SUPABASE_URL / SUPABASE_SECRET_KEY', config.supabase ? 'ok' : undefined);
  required('OPENAI_API_KEY', config.openai ? 'ok' : undefined);
  required('OPENAI_TRANSLATE_MODEL', config.openai?.model);
}
