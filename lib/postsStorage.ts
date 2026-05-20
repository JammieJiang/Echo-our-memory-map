import { LittleWorldPost, BBPost } from './types';
import { formatEchoDate, Locale } from './i18n';

const LW_KEY = 'echo-little-world';
const BB_KEY = 'echo-bb-machine';

export function firstLine(text: string, max = 72): string {
  const line = text.trim().split(/\n/)[0] || '';
  if (line.length <= max) return line;
  return `${line.slice(0, max)}…`;
}

export function formatTimeSmall(timestamp: number, locale: Locale): string {
  return new Date(timestamp).toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function loadLittleWorld(): LittleWorldPost[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LW_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLittleWorld(posts: LittleWorldPost[]) {
  localStorage.setItem(LW_KEY, JSON.stringify(posts));
}

export function loadBBPosts(): BBPost[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBBPosts(posts: BBPost[]) {
  localStorage.setItem(BB_KEY, JSON.stringify(posts));
}

export function createLittleWorldPost(text: string, locale: Locale): LittleWorldPost {
  const ts = Date.now();
  return {
    id: String(ts),
    text: text.trim(),
    timestamp: ts,
    createdAt: formatEchoDate(ts, locale),
  };
}

export function createBBPost(
  data: Omit<BBPost, 'id' | 'timestamp' | 'createdAt'>,
  locale: Locale
): BBPost {
  const ts = Date.now();
  return {
    ...data,
    id: String(ts),
    timestamp: ts,
    createdAt: formatEchoDate(ts, locale),
  };
}
