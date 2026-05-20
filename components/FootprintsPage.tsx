'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Echo } from '@/lib/types';
import SubPageShell from '@/components/SubPageShell';
import GlassBubble from '@/components/GlassBubble';
import UserAvatar from '@/components/UserAvatar';
import { USERS } from '@/lib/mockData';
import { extractCityZh, CITY_CATALOG } from '@/lib/cities';
import { useLocale } from '@/components/LocaleProvider';

interface FootprintsPageProps {
  echoes: Echo[];
  onBack: () => void;
  onSelectEcho: (echo: Echo) => void;
  onRequestDelete: (echo: Echo) => void;
}

export default function FootprintsPage({
  echoes,
  onBack,
  onSelectEcho,
  onRequestDelete,
}: FootprintsPageProps) {
  const { t, locale } = useLocale();
  const sorted = [...echoes].sort((a, b) => b.timestamp - a.timestamp);

  const cityLabel = (placeName: string) => {
    const zh = extractCityZh(placeName);
    if (locale === 'en') {
      return CITY_CATALOG.find((c) => c.zh === zh)?.en ?? zh;
    }
    return zh;
  };

  return (
    <SubPageShell title={t('footprintsTitle')} onBack={onBack}>
      <div className="h-full space-y-3 overflow-y-auto pr-1 pb-4">
        {sorted.length === 0 ? (
          <GlassBubble variant="yellow" className="py-8 text-center">
            <p className="text-[14px] text-[#a8949c]">{t('footprintsEmpty')}</p>
          </GlassBubble>
        ) : (
          sorted.map((echo, i) => {
            const userMeta = USERS.find((u) => u.id === echo.userId);
            return (
              <motion.div
                key={echo.id ? `footprint-${echo.id}` : `footprint-${i}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 320, damping: 28 }}
                className="relative"
              >
                <GlassBubble
                  variant={echo.userId === '1' ? 'pink' : echo.userId === '2' ? 'blue' : 'yellow'}
                  className="pr-10"
                >
                  <button type="button" className="w-full text-left" onClick={() => onSelectEcho(echo)}>
                    <div className="mb-2 flex items-center gap-3">
                      <UserAvatar
                        user={{
                          name: echo.userName,
                          avatar: echo.userAvatar,
                          color: userMeta?.color ?? '#ffb8d0',
                        }}
                        size="sm"
                      />
                      <span className="text-[15px] font-extrabold text-[#6b5b63]">{echo.userName}</span>
                    </div>
                    <p className="mb-1 text-[12px] font-bold text-[#a8949c]">🕐 {echo.createdAt}</p>
                    <p className="text-[14px] font-bold text-[#6b5b63]">📍 {cityLabel(echo.placeName)}</p>
                    <p className="mt-0.5 truncate text-[12px] text-[#a8949c]">{echo.placeName}</p>
                  </button>
                </GlassBubble>
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRequestDelete(echo);
                  }}
                  className="absolute bottom-3 right-3 flex h-6 w-6 items-center justify-center rounded-full border border-[#ffd6e8] bg-white/90 text-[#c4b0b8] shadow-sm hover:border-[#ffb8d0] hover:text-[#ff8a9b]"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Delete"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                </motion.button>
              </motion.div>
            );
          })
        )}
      </div>
    </SubPageShell>
  );
}
