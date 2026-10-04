/**
 * The static course index used by the header search and the home/weak-area widgets. Fetched once
 * on demand; if it cannot load, every feature that depends on it degrades to a visible message.
 */
import { normaliseSearch } from './dom.ts';

export interface IndexEntry {
  type: 'concept' | 'formula' | 'question';
  title: string;
  en?: string;
  href: string;
  text: string;
  part?: string;
  id?: string;
}

let cached: IndexEntry[] | null = null;
let failed = false;

export async function loadCourseIndex(): Promise<IndexEntry[] | null> {
  if (cached) return cached;
  if (failed) return null;
  const prefix = document.body.dataset.prefix ?? '';
  try {
    const response = await fetch(`${prefix}search-index.json`, { credentials: 'omit' });
    if (!response.ok) throw new Error(String(response.status));
    cached = (await response.json()) as IndexEntry[];
    return cached;
  } catch {
    failed = true;
    return null;
  }
}

export function searchIndex(entries: IndexEntry[], query: string, limit = 8): { entry: IndexEntry; score: number }[] {
  const term = normaliseSearch(query);
  if (term.length < 2) return [];
  const scoreOf = (entry: IndexEntry): number => {
    const title = normaliseSearch(entry.title);
    const en = normaliseSearch(entry.en ?? '');
    const text = normaliseSearch(entry.text);
    if (title.includes(term)) return title.startsWith(term) ? 100 : 80;
    if (en.includes(term)) return 60;
    if (text.includes(term)) return 40;
    return 0;
  };
  return entries
    .map((entry) => ({ entry, score: scoreOf(entry) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}