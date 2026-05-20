'use client';

import { motion } from 'framer-motion';
import { firstLine, formatTimeSmall } from '@/lib/postsStorage';
import { useLocale } from '@/components/LocaleProvider';
import GlassBubble from '@/components/GlassBubble';
import UserAvatar from '@/components/UserAvatar';

interface PostBubbleCardProps {
  text: string;
  timestamp: number;
  variant?: 'pink' | 'blue' | 'yellow' | 'lavender' | 'white';
  user?: { name: string; avatar: string; color: string };
  anonymous?: boolean;
  onClick: () => void;
}

export default function PostBubbleCard({
  text,
  timestamp,
  variant = 'white',
  user,
  anonymous,
  onClick,
}: PostBubbleCardProps) {
  const { locale } = useLocale();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="w-full text-left"
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
    >
      <GlassBubble variant={variant} className="relative min-h-[72px] pr-3 pb-6 pt-3">
        {user && !anonymous && (
          <div className="mb-2 flex items-center gap-2">
            <UserAvatar user={user} size="sm" />
            <span className="text-[13px] font-bold text-[#6b5b63]">{user.name}</span>
          </div>
        )}
        {anonymous && (
          <p className="mb-1.5 text-[11px] font-bold text-[#c4a8e8]">🌙</p>
        )}
        <p className="text-[14px] leading-relaxed text-[#6b5b63]">{firstLine(text)}</p>
        <span className="absolute bottom-2 right-3 text-[10px] font-medium text-[#c4b0b8]">
          {formatTimeSmall(timestamp, locale)}
        </span>
      </GlassBubble>
    </motion.button>
  );
}
