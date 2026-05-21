import { User, Echo } from './types';
import { resolveImageUrl } from './cloud/client';

export const USERS: User[] = [
  {
    id: '1',
    name: '🐏',
    avatar: '/avatars/user1.svg',
    color: '#ffb8d0',
  },
  {
    id: '2',
    name: '🐕',
    avatar: '/avatars/user2.svg',
    color: '#8ecdf5',
  },
  {
    id: '3',
    name: '🐇',
    avatar: '/avatars/user3.svg',
    color: '#ffe9a8',
  },
];

const LEGACY_USER_NAMES: Record<string, string> = {
  用户1: '🐏',
  用户2: '🐕',
  用户3: '🐇',
};

export const MOCK_ECHOES: Echo[] = [
  {
    id: '1',
    userId: '1',
    userName: '🐏',
    userAvatar: '/avatars/user1.svg',
    latitude: 39.9042,
    longitude: 116.4074,
    placeName: '北京 · 798艺术区',
    description: '今天在798看了个很棒的艺术展，想起你们。',
    photos: [],
    timestamp: Date.now() - 86400000 * 2,
    createdAt: new Date(Date.now() - 86400000 * 2).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  },
  {
    id: '2',
    userId: '2',
    userName: '🐕',
    userAvatar: '/avatars/user2.svg',
    latitude: 31.2304,
    longitude: 121.4737,
    placeName: '上海 · 外滩',
    description: '黄浦江边的日落很美，这一刻我们虽然距离遥远，但心却在一起。',
    photos: [],
    timestamp: Date.now() - 86400000,
    createdAt: new Date(Date.now() - 86400000).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  },
  {
    id: '3',
    userId: '3',
    userName: '🐇',
    userAvatar: '/avatars/user3.svg',
    latitude: 28.2282,
    longitude: 112.9388,
    placeName: '长沙 · 橘子洲头',
    description: '在这里又想起我们一起的笑声，回声依旧。',
    photos: [],
    timestamp: Date.now(),
    createdAt: new Date(Date.now()).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  },
];

export const LOGIN_PASSWORD = '0721';

/** 从 localStorage 合并用户自定义头像 */
export function getUsersWithStoredAvatars(): User[] {
  if (typeof window === 'undefined') return USERS;

  try {
    const stored = localStorage.getItem('userAvatars');
    if (!stored) return USERS;
    const map = JSON.parse(stored) as Record<string, string>;
    return USERS.map((u) =>
      map[u.id] ? { ...u, avatar: map[u.id] } : u
    );
  } catch {
    return USERS;
  }
}

/** 将 localStorage 里旧昵称的 Echo 迁移为新昵称 */
export function migrateEchoes(echoes: Echo[]): Echo[] {
  return echoes.map((echo) => {
    const userName = LEGACY_USER_NAMES[echo.userName] ?? echo.userName;
    const user = USERS.find((u) => u.id === echo.userId);
    return {
      ...echo,
      userName,
      userAvatar: user?.avatar ?? echo.userAvatar,
    };
  });
}

export async function saveUserAvatar(userId: string, dataUrl: string) {
  const url = (await resolveImageUrl(dataUrl)) ?? dataUrl;
  const stored = localStorage.getItem('userAvatars');
  const map = stored ? JSON.parse(stored) : {};
  map[userId] = url;
  localStorage.setItem('userAvatars', JSON.stringify(map));
}
