import type { APIRoute } from 'astro';
import { assertSameOrigin, endSession, errorResponse, json } from '../../../lib/guestbook/security';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  try {
    assertSameOrigin(context);
    endSession(context.cookies);
    return json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
};
