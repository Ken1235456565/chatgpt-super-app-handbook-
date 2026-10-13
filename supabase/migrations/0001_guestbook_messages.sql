-- Guestbook comments. See docs/COMMENT_FEATURE_DESIGN.md.
create table if not exists public.guestbook_messages (
  id          bigint generated always as identity primary key,
  name        text not null default 'Anonymous' check (char_length(name) between 1 and 40),
  body        text not null check (char_length(body) between 1 and 2000),
  lang        text not null default 'und',
  translation text,
  ip_hash     text not null,
  created_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

create index if not exists guestbook_messages_visible_idx
  on public.guestbook_messages (created_at desc)
  where deleted_at is null;

create index if not exists guestbook_messages_rate_idx
  on public.guestbook_messages (ip_hash, created_at desc);

-- No policies: the public anon key has no access. The site server uses the secret key.
alter table public.guestbook_messages enable row level security;
