import { BBPost, Echo, LittleWorldPost } from '@/lib/types';

export type EchoRow = {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  latitude: number;
  longitude: number;
  place_name: string;
  description: string;
  photos: string[];
  timestamp: number;
  created_at: string;
};

export type LittleWorldRow = {
  id: string;
  text: string;
  timestamp: number;
  created_at: string;
};

export type BBRow = {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  type: 'text' | 'screenshot';
  text: string;
  screenshot: string | null;
  timestamp: number;
  created_at: string;
};

export function echoFromRow(row: EchoRow): Echo {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    userAvatar: row.user_avatar,
    latitude: row.latitude,
    longitude: row.longitude,
    placeName: row.place_name,
    description: row.description,
    photos: Array.isArray(row.photos) ? row.photos : [],
    timestamp: Number(row.timestamp),
    createdAt: row.created_at,
  };
}

export function echoToRow(echo: Echo): EchoRow {
  return {
    id: echo.id,
    user_id: echo.userId,
    user_name: echo.userName,
    user_avatar: echo.userAvatar,
    latitude: echo.latitude,
    longitude: echo.longitude,
    place_name: echo.placeName,
    description: echo.description,
    photos: echo.photos,
    timestamp: echo.timestamp,
    created_at: echo.createdAt,
  };
}

export function littleWorldFromRow(row: LittleWorldRow): LittleWorldPost {
  return {
    id: row.id,
    text: row.text,
    timestamp: Number(row.timestamp),
    createdAt: row.created_at,
  };
}

export function littleWorldToRow(post: LittleWorldPost): LittleWorldRow {
  return {
    id: post.id,
    text: post.text,
    timestamp: post.timestamp,
    created_at: post.createdAt,
  };
}

export function bbFromRow(row: BBRow): BBPost {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    userAvatar: row.user_avatar,
    type: row.type,
    text: row.text,
    screenshot: row.screenshot ?? undefined,
    timestamp: Number(row.timestamp),
    createdAt: row.created_at,
  };
}

export function bbToRow(post: BBPost): BBRow {
  return {
    id: post.id,
    user_id: post.userId,
    user_name: post.userName,
    user_avatar: post.userAvatar,
    type: post.type,
    text: post.text,
    screenshot: post.screenshot ?? null,
    timestamp: post.timestamp,
    created_at: post.createdAt,
  };
}
