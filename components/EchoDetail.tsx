'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Echo } from '@/lib/types';
import { USERS } from '@/lib/mockData';
import UserAvatar from '@/components/UserAvatar';
import GlassBubble from '@/components/GlassBubble';
import { useLocale } from '@/components/LocaleProvider';

interface EchoDetailProps {
  echo: Echo;
  onClose: () => void;
  onRequestDelete?: () => void;
}

const BUBBLE_CLASS: Record<string, string> = {
  '1': 'bubble-user-1',
  '2': 'bubble-user-2',
  '3': 'bubble-user-3',
};

export default function EchoDetail({ echo, onClose, onRequestDelete }: EchoDetailProps) {
  const { t } = useLocale();
  const userMeta = USERS.find((u) => u.id === echo.userId);
  const avatarUser = {
    name: echo.userName,
    avatar: echo.userAvatar,
    color: userMeta?.color ?? '#ffb8d0',
  };
  const bubbleClass = BUBBLE_CLASS[echo.userId] ?? 'bubble-user-2';

  return (
    <motion.div
      key={`echo-detail-${echo.id}`}
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center echo-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="macaron-glass-card echo-modal-sheet relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-7"
        initial={{ scale: 0.88, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 360, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <GlassBubble variant="blue" className="mb-4 flex items-center gap-3">
          <UserAvatar user={avatarUser} size="lg" />
          <div>
            <h2 className="text-[20px] font-extrabold text-[#6b5b63]">{echo.userName}</h2>
            <p className="text-[13px] text-[#a8949c]">{echo.createdAt}</p>
          </div>
        </GlassBubble>

        <GlassBubble variant="yellow" className="mb-4">
          <p className="text-[15px] font-bold text-[#6b5b63]">📍 {echo.placeName}</p>
        </GlassBubble>

        {echo.photos?.length > 0 && (
          <GlassBubble variant="white" className="mb-4 p-2">
            <img src={echo.photos[0]} alt="" className="max-h-64 w-full rounded-[16px] object-cover" />
          </GlassBubble>
        )}

        <div className="mb-4 flex items-end gap-2">
          <UserAvatar user={avatarUser} size="sm" className="mb-1 shrink-0" />
          <div className={`max-w-[85%] px-4 py-3 text-[15px] font-medium leading-relaxed ${bubbleClass}`}>
            {echo.description}
          </div>
        </div>

        {onRequestDelete && (
          <div className="mb-4 flex justify-center">
            <motion.button
              type="button"
              onClick={onRequestDelete}
              className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#ffd6e8] bg-white/90 text-[#c4b0b8] shadow-sm"
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Delete"
            >
              <X className="h-4 w-4" strokeWidth={2.5} />
            </motion.button>
          </div>
        )}

        <motion.button
          type="button"
          onClick={onClose}
          className="macaron-btn-blue flex w-full items-center justify-center gap-2 py-3 text-[15px] font-bold text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t('closePage')}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
