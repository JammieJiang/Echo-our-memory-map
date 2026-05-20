'use client';

import { User } from '@/lib/types';

interface UserAvatarProps {
  user: Pick<User, 'name' | 'avatar' | 'color'>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-9 h-9 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-xl',
};

function isImageAvatar(avatar: string): boolean {
  return avatar.startsWith('/') || avatar.startsWith('data:') || avatar.startsWith('http');
}

export default function UserAvatar({
  user,
  size = 'md',
  className = '',
}: UserAvatarProps) {
  const ringStyle = { boxShadow: `0 0 0 3px white, 0 4px 12px ${user.color}55` };

  if (isImageAvatar(user.avatar)) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        style={ringStyle}
        className={`${sizeMap[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      style={{ ...ringStyle, backgroundColor: user.color }}
      className={`${sizeMap[size]} rounded-full flex items-center justify-center font-bold text-white ${className}`}
      aria-hidden
    >
      {user.name}
    </div>
  );
}
