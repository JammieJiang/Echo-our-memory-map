import { BBPost, Echo, LittleWorldPost } from '@/lib/types';

export function isCloudEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** 上传图片到 Supabase Storage，返回公网 URL；未配置云时原样返回 data URL */
export async function resolveImageUrl(
  source: string | File | null | undefined
): Promise<string | undefined> {
  if (!source) return undefined;
  if (typeof source === 'string') {
    if (!isCloudEnabled()) return source;
    if (source.startsWith('http://') || source.startsWith('https://') || source.startsWith('/')) {
      return source;
    }
    if (source.startsWith('data:')) {
      const form = new FormData();
      form.append('dataUrl', source);
      const { url } = await apiJson<{ url: string }>('/api/upload', { method: 'POST', body: form });
      return url;
    }
    return source;
  }
  if (!isCloudEnabled()) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(source);
    });
  }
  const form = new FormData();
  form.append('file', source);
  const { url } = await apiJson<{ url: string }>('/api/upload', { method: 'POST', body: form });
  return url;
}

export async function fetchEchoesCloud(): Promise<Echo[]> {
  const { echoes } = await apiJson<{ echoes: Echo[] }>('/api/echoes');
  return echoes;
}

export async function createEchoCloud(echo: Echo): Promise<void> {
  await apiJson('/api/echoes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(echo),
  });
}

export async function deleteEchoCloud(id: string): Promise<void> {
  await apiJson(`/api/echoes?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function syncEchoesCloud(echoes: Echo[]): Promise<void> {
  await apiJson('/api/echoes', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ echoes }),
  });
}

export async function fetchLittleWorldCloud(): Promise<LittleWorldPost[]> {
  const { posts } = await apiJson<{ posts: LittleWorldPost[] }>('/api/little-world');
  return posts;
}

export async function createLittleWorldCloud(post: LittleWorldPost): Promise<void> {
  await apiJson('/api/little-world', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
}

export async function fetchBBPostsCloud(): Promise<BBPost[]> {
  const { posts } = await apiJson<{ posts: BBPost[] }>('/api/bb');
  return posts;
}

export async function createBBPostCloud(post: BBPost): Promise<void> {
  await apiJson('/api/bb', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
}
