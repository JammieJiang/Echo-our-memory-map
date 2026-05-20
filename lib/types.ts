export interface User {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

export interface Echo {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  latitude: number;
  longitude: number;
  placeName: string;
  description: string;
  photos: string[];
  timestamp: number;
  createdAt: string;
}

/** 小世界 — 匿名树洞 */
export interface LittleWorldPost {
  id: string;
  text: string;
  timestamp: number;
  createdAt: string;
}

/** BB机 — 实名留言或截图 */
export interface BBPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'text' | 'screenshot';
  text: string;
  screenshot?: string;
  timestamp: number;
  createdAt: string;
}

export interface PlaceSuggestion {
  id: string;
  label: string;
  placeName: string;
  lat: number;
  lng: number;
}

export interface AuthState {
  isLoggedIn: boolean;
  currentUser?: User;
}
