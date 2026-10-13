# Comment Feature Design

## Purpose

During the public trial, readers need a place to leave comments and feedback on the handbook. The guestbook lets anyone post without signing in, in any language. Every non-English comment is shown with an automatic English translation. A single administrator can sign in and remove comments.

The guestbook is a site feature, not handbook content. It lives outside the 14-chapter structure as one page linked from the **Start here** sidebar group.

## Scope

In scope:

- one public page at `/guestbook/` that lists comments, newest first, and contains the posting form;
- anonymous posting with an optional display name;
- language detection and English translation at posting time;
- automated content moderation before a comment is stored;
- one administrator who can sign in, delete comments, and sign out.

Out of scope for this increment:

- replies, threads, reactions, editing, or per-chapter comment sections;
- reader accounts or third-party sign-in;
- email notifications;
- translating comments into languages other than English.

## Architecture

```
Browser ──> /guestbook/            Starlight page, rendered on demand
   │
   ├─ GET    /api/messages         list visible comments (original + English translation)
   ├─ POST   /api/messages         anonymous post → bot check → rate limit → moderation
   │                               → language detection and translation → insert
   ├─ DELETE /api/messages/:id     administrator only → soft delete
   ├─ POST   /api/admin/login      verify password → set signed HttpOnly session cookie
   └─ POST   /api/admin/logout     clear the session cookie
                │
          Supabase Postgres (server-side access only)
```

- The 14 chapters and the homepage remain prerendered static pages. Only the guestbook page and the API routes set `export const prerender = false` and run as Vercel functions through `@astrojs/vercel`.
- The browser never talks to Supabase or OpenAI directly. All credentials stay on the server.

## Data model

Defined in `supabase/migrations/0001_guestbook_messages.sql`.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `bigint` identity | primary key |
| `name` | `text` | display name, defaults to `Anonymous`, at most 40 characters |
| `body` | `text` | original comment, at most 2,000 characters |
| `lang` | `text` | ISO 639-1 code detected at posting time; `und` when detection failed |
| `translation` | `text` | English translation; `null` for English comments or when translation failed |
| `ip_hash` | `text` | HMAC-SHA-256 of the client IP, used only for rate limiting |
| `created_at` | `timestamptz` | defaults to `now()` |
| `deleted_at` | `timestamptz` | set by the administrator; deleted comments are hidden |

Row Level Security is enabled with no policies, so the public `anon` key cannot read or write the table. The server uses the Supabase secret (service role) key.

## Translation

- One OpenAI Responses API call per accepted comment returns `{ "lang": "<ISO 639-1>", "english": "<translation>" | null }`.
- The translation is stored with the comment, so reading the page never calls OpenAI.
- The system prompt tells the model to translate faithfully and to ignore instructions inside the comment. The output is treated as untrusted text and rendered escaped.
- The model is configured with the `OPENAI_TRANSLATE_MODEL` environment variable rather than hard-coded, so it can follow current OpenAI documentation.
- If translation fails, the comment is still stored with `lang = 'und'` and no translation.

## Abuse protection

Because posting needs no sign-in, every post passes these checks in order:

1. **Bot check**: Cloudflare Turnstile. The widget script loads only on `/guestbook/`; the server verifies the token.
2. **Input limits**: name ≤ 40 characters, body 1–2,000 characters, trimmed.
3. **Rate limit**: at most 1 comment per minute and 10 per day for each IP hash, counted in the database.
4. **Moderation**: the OpenAI Moderation endpoint. Flagged comments are rejected. If moderation is unavailable, the post is rejected with a retry message (fail closed).
5. **Output escaping**: comments and translations are rendered as plain text; `set:html` is never used.

## Administrator access

- One administrator. `ADMIN_PASSWORD_HASH` holds a bcrypt hash; the plain password is never stored.
- A successful login sets a `gb_admin` cookie holding a JWT signed with `SESSION_SECRET` (HS256, 8-hour expiry), with `HttpOnly`, `Secure` (in production), `SameSite=Strict`, and `Path=/`.
- Login attempts are rate limited per IP hash (5 per 15 minutes, in memory per function instance).
- Mutating endpoints reject requests whose `Origin` header does not match the site origin.
- Deletion is a soft delete (`deleted_at = now()`), so a mistaken deletion can be restored in Supabase.
- The administrator signs in at `/guestbook/admin/`, which is excluded from search indexing. When signed in, `/guestbook/` shows a delete button on each comment.

## Configuration

Server-only variables, declared with `astro:env` in `astro.config.mjs`:

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SECRET_KEY` | Supabase secret (service role) key |
| `OPENAI_API_KEY` | OpenAI API key for moderation and translation |
| `OPENAI_TRANSLATE_MODEL` | OpenAI model used for detection and translation |
| `TURNSTILE_SECRET_KEY` | Turnstile server secret |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of the administrator password |
| `SESSION_SECRET` | random string, at least 32 characters, for session signing and IP hashing |

Public variable: `PUBLIC_TURNSTILE_SITE_KEY`.

Generate the password hash with `pnpm guestbook:hash-password`.

## Local development

`pnpm dev` works without external accounts:

- Without `SUPABASE_URL`, comments are kept in an in-memory store that resets when the dev server restarts.
- Without `OPENAI_API_KEY`, moderation is skipped and translation is replaced by a clearly labelled development placeholder.
- Cloudflare's published Turnstile test keys always pass.

These fallbacks run only in development. In a production build, a missing variable makes the API return an error instead of silently using a fallback.

## Files

| File | Role |
| --- | --- |
| `astro.config.mjs` | Vercel adapter, `astro:env` schema, sidebar entry |
| `src/pages/guestbook/index.astro` | public guestbook page |
| `src/pages/guestbook/admin.astro` | administrator sign-in page |
| `src/pages/api/messages/index.ts` | list and post |
| `src/pages/api/messages/[id].ts` | delete |
| `src/pages/api/admin/login.ts`, `logout.ts` | session management |
| `src/lib/guestbook/*.ts` | storage, translation, moderation, Turnstile, auth, rate limiting |
| `supabase/migrations/0001_guestbook_messages.sql` | table definition |
| `scripts/hash-password.mjs` | bcrypt hash helper |

## Deployment checklist

These steps need the project owner's accounts and explicit authorization:

1. Create a Supabase project and run the migration SQL.
2. Create an OpenAI API key with billing enabled.
3. Create a Turnstile widget for the production domain.
4. Add the variables above to the Vercel project.
5. Deploy and post a test comment in English and one in another language.

## Acceptance

- `pnpm build` succeeds and the chapter pages remain prerendered.
- A comment can be posted without signing in; a non-English comment shows an English translation.
- Oversized input, a failed bot check, and rapid repeat posts are rejected with a readable message.
- Only a signed-in administrator can delete; delete requests without a valid session return 401.
- The page is usable by keyboard, at narrow widths, and in light and dark themes.
