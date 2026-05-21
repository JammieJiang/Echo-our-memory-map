import { Echo } from './types';
import { migrateEchoes } from './mockData';
import {
  isCloudEnabled,
  fetchEchoesCloud,
  createEchoCloud,
  deleteEchoCloud,
  syncEchoesCloud,
} from './cloud/client';

const ECHO_KEY = 'echoes';

export function loadEchoesLocal(): Echo[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ECHO_KEY);
    if (!raw) return null;
    return migrateEchoes(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveEchoesLocal(echoes: Echo[]) {
  localStorage.setItem(ECHO_KEY, JSON.stringify(echoes));
}

/** 从云端加载；失败则返回 null */
export async function loadEchoesFromCloud(): Promise<Echo[] | null> {
  if (!isCloudEnabled()) return null;
  try {
    const echoes = await fetchEchoesCloud();
    saveEchoesLocal(echoes);
    return migrateEchoes(echoes);
  } catch (e) {
    console.error('Cloud load echoes failed', e);
    return null;
  }
}

export async function addEcho(echo: Echo, currentList: Echo[]): Promise<Echo[]> {
  const next = [...currentList, echo];
  saveEchoesLocal(next);
  if (isCloudEnabled()) {
    await createEchoCloud(echo);
  }
  return next;
}

export async function removeEcho(id: string, currentList: Echo[]): Promise<Echo[]> {
  const next = currentList.filter((e) => e.id !== id);
  saveEchoesLocal(next);
  if (isCloudEnabled()) {
    await deleteEchoCloud(id);
  }
  return next;
}

/** 首次启用云时，把本机数据推到云端 */
export async function pushLocalEchoesToCloud(local: Echo[]): Promise<void> {
  if (!isCloudEnabled() || local.length === 0) return;
  await syncEchoesCloud(local);
}
