import type { APIRoute } from 'astro';
import { assertProductionServices, GuestbookError } from '../../../lib/guestbook/config';
import { assertSameOrigin, errorResponse, isAdmin, json } from '../../../lib/guestbook/security';
import { getStore } from '../../../lib/guestbook/store';

export const prerender = false;

export const DELETE: APIRoute = async (context) => {
  try {
    assertProductionServices();
    assertSameOrigin(context);
    if (!(await isAdmin(context.cookies))) throw new GuestbookError(401, 'Administrator sign-in required.');

    const id = Number(context.params.id);
    if (!Number.isSafeInteger(id) || id < 1) throw new GuestbookError(400, 'Invalid comment id.');
    if (!(await getStore().softDelete(id))) throw new GuestbookError(404, 'Comment not found.');
    return json({ deleted: id });
  } catch (error) {
    return errorResponse(error);
  }
};
