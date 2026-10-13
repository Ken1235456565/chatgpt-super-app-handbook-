import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { config, GuestbookError } from './config';

export interface Message {
  id: number;
  name: string;
  body: string;
  lang: string;
  translation: string | null;
  createdAt: string;
}

export interface NewMessage {
  name: string;
  body: string;
  lang: string;
  translation: string | null;
  ipHash: string;
}

interface Store {
  list(): Promise<Message[]>;
  insert(message: NewMessage): Promise<Message>;
  softDelete(id: number): Promise<boolean>;
  countSince(ipHash: string, since: Date): Promise<number>;
}

const LIST_LIMIT = 200;
const TABLE = 'guestbook_messages';
const COLUMNS = 'id, name, body, lang, translation, created_at';

type Row = { id: number; name: string; body: string; lang: string; translation: string | null; created_at: string };

const toMessage = (row: Row): Message => ({
  id: row.id,
  name: row.name,
  body: row.body,
  lang: row.lang,
  translation: row.translation,
  createdAt: row.created_at,
});

function fail(action: string, error: unknown): never {
  console.error(`[guestbook] ${action} failed`, error);
  throw new GuestbookError(502, 'The comment store is unavailable. Please try again later.');
}

function supabaseStore(client: SupabaseClient): Store {
  return {
    async list() {
      const { data, error } = await client
        .from(TABLE)
        .select(COLUMNS)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(LIST_LIMIT);
      if (error) fail('list', error);
      return (data as Row[]).map(toMessage);
    },
    async insert({ ipHash, ...message }) {
      const { data, error } = await client
        .from(TABLE)
        .insert({ ...message, ip_hash: ipHash })
        .select(COLUMNS)
        .single();
      if (error) fail('insert', error);
      return toMessage(data as Row);
    },
    async softDelete(id) {
      const { data, error } = await client
        .from(TABLE)
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .is('deleted_at', null)
        .select('id');
      if (error) fail('delete', error);
      return data.length > 0;
    },
    async countSince(ipHash, since) {
      const { count, error } = await client
        .from(TABLE)
        .select('id', { count: 'exact', head: true })
        .eq('ip_hash', ipHash)
        .gte('created_at', since.toISOString());
      if (error) fail('count', error);
      return count ?? 0;
    },
  };
}

/** Development fallback. Lives on globalThis so it survives module reloads, not server restarts. */
function memoryStore(): Store {
  type MemoryRow = Message & { ipHash: string; deleted: boolean };
  const state = ((globalThis as { __guestbook?: { rows: MemoryRow[]; nextId: number } }).__guestbook ??= {
    rows: [],
    nextId: 1,
  });
  const strip = ({ ipHash: _ip, deleted: _deleted, ...message }: MemoryRow): Message => message;

  return {
    async list() {
      return state.rows.filter((row) => !row.deleted).reverse().slice(0, LIST_LIMIT).map(strip);
    },
    async insert(message) {
      const row = { ...message, id: state.nextId++, createdAt: new Date().toISOString(), deleted: false };
      state.rows.push(row);
      return strip(row);
    },
    async softDelete(id) {
      const row = state.rows.find((candidate) => candidate.id === id && !candidate.deleted);
      if (row) row.deleted = true;
      return Boolean(row);
    },
    async countSince(ipHash, since) {
      return state.rows.filter((row) => row.ipHash === ipHash && new Date(row.createdAt) >= since).length;
    },
  };
}

let store: Store | undefined;

export function getStore(): Store {
  store ??= config.supabase
    ? supabaseStore(createClient(config.supabase.url, config.supabase.key, { auth: { persistSession: false } }))
    : memoryStore();
  return store;
}
