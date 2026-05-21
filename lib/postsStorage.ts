import { LittleWorldPost, BBPost } from './types';
import { formatEchoDate, Locale } from './i18n';
import {
  isCloudEnabled,
  fetchLittleWorldCloud,
  createLittleWorldCloud,
  fetchBBPostsCloud,
  createBBPostCloud,
} from './cloud/client';

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

function loadLocalLittleWorld(): LittleWorldPost[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LW_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalLittleWorld(posts: LittleWorldPost[]) {
  localStorage.setItem(LW_KEY, JSON.stringify(posts));
}

function loadLocalBBPosts(): BBPost[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalBBPosts(posts: BBPost[]) {
  localStorage.setItem(BB_KEY, JSON.stringify(posts));
}

export async function loadLittleWorld(): Promise<LittleWorldPost[]> {
  if (isCloudEnabled()) {
    try {
      const posts = await fetchLittleWorldCloud();
      saveLocalLittleWorld(posts);
      return posts;
    } catch (e) {
      console.error('Cloud load little world failed', e);
    }
  }
  return loadLocalLittleWorld();
}

export function saveLittleWorld(posts: LittleWorldPost[]) {
  saveLocalLittleWorld(posts);
}

export async function addLittleWorldPost(post: LittleWorldPost): Promise<void> {
  const local = loadLocalLittleWorld();
  const next = [post, ...local];
  saveLocalLittleWorld(next);
  if (isCloudEnabled()) {
    await createLittleWorldCloud(post);
  }
}

export async function loadBBPosts(): Promise<BBPost[]> {
  if (isCloudEnabled()) {
    try {
      const posts = await fetchBBPostsCloud();
      saveLocalBBPosts(posts);
      return posts;
    } catch (e) {
      console.error('Cloud load BB failed', e);
    }
  }
  return loadLocalBBPosts();
}

export function saveBBPosts(posts: BBPost[]) {
  saveLocalBBPosts(posts);
}

export async function addBBPost(post: BBPost): Promise<void> {
  const local = loadLocalBBPosts();
  const next = [post, ...local];
  saveLocalBBPosts(next);
  if (isCloudEnabled()) {
    await createBBPostCloud(post);
  }
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
