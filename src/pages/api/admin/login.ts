import type { APIRoute } from 'astro';
import { GuestbookError } from '../../../lib/guestbook/config';
import {
  assertSameOrigin,
  checkPassword,
  clientIp,
  errorResponse,
  hashIp,
  json,
  startSession,
  throttleLogin,
} from '../../../lib/guestbook/security';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  try {
    assertSameOrigin(context);
    throttleLogin(await hashIp(clientIp(context)));

    const input = (await context.request.json().catch(() => null)) as { password?: unknown } | null;
    if (!(await checkPassword(input?.password))) throw new GuestbookError(401, 'Incorrect password.');

    await startSession(context.cookies);
    return json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
};
