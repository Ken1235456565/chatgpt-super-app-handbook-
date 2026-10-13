import type { APIRoute } from 'astro';
import { assertProductionServices, GuestbookError, LIMITS } from '../../../lib/guestbook/config';
import { moderate, translate } from '../../../lib/guestbook/openai';
import {
  assertSameOrigin,
  clientIp,
  errorResponse,
  hashIp,
  json,
  verifyTurnstile,
} from '../../../lib/guestbook/security';
import { getStore } from '../../../lib/guestbook/store';

export const prerender = false;

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

export const GET: APIRoute = async () => {
  try {
    assertProductionServices();
    return json({ messages: await getStore().list() });
  } catch (error) {
    return errorResponse(error);
  }
};

export const POST: APIRoute = async (context) => {
  try {
    assertProductionServices();
    assertSameOrigin(context);

    const input = (await context.request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!input) throw new GuestbookError(400, 'Invalid request.');

    const name = typeof input.name === 'string' ? input.name.trim() || 'Anonymous' : 'Anonymous';
    const body = typeof input.body === 'string' ? input.body.trim() : '';
    if (!body) throw new GuestbookError(400, 'Please write a comment.');
    if ([...name].length > LIMITS.nameLength) {
      throw new GuestbookError(400, `Names can be at most ${LIMITS.nameLength} characters.`);
    }
    if ([...body].length > LIMITS.bodyLength) {
      throw new GuestbookError(400, `Comments can be at most ${LIMITS.bodyLength} characters.`);
    }

    const ip = clientIp(context);
    await verifyTurnstile(input.token, ip);

    const store = getStore();
    const ipHash = await hashIp(ip);
    const now = Date.now();
    if ((await store.countSince(ipHash, new Date(now - MINUTE))) >= LIMITS.perMinute) {
      throw new GuestbookError(429, 'Please wait a minute before posting again.');
    }
    if ((await store.countSince(ipHash, new Date(now - DAY))) >= LIMITS.perDay) {
      throw new GuestbookError(429, 'You have reached the daily comment limit. Please come back tomorrow.');
    }

    await moderate(`${name}\n\n${body}`);
    const { lang, english } = await translate(body);
    const message = await store.insert({ name, body, lang, translation: english, ipHash });
    return json({ message }, 201);
  } catch (error) {
    return errorResponse(error);
  }
};
