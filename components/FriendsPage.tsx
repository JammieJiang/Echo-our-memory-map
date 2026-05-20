'use client';

import { motion } from 'framer-motion';
import SubPageShell from '@/components/SubPageShell';
import GlassBubble from '@/components/GlassBubble';
import UserAvatar from '@/components/UserAvatar';
import { getUsersWithStoredAvatars } from '@/lib/mockData';
import { useLocale } from '@/components/LocaleProvider';
import { Echo } from '@/lib/types';

interface FriendsPageProps {
  echoes: Echo[];
  onBack: () => void;
}

export default function FriendsPage({ echoes, onBack }: FriendsPageProps) {
  const { t } = useLocale();
  const users = getUsersWithStoredAvatars();

  return (
    <SubPageShell title={t('friendsTitle')} onBack={onBack}>
      <div className="h-full space-y-4 overflow-y-auto pb-4">
        {users.map((user, i) => {
          const count = echoes.filter((e) => e.userId === user.id).length;
          const variant = user.id === '1' ? 'pink' : user.id === '2' ? 'blue' : 'yellow';
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 26 }}
            >
              <GlassBubble variant={variant} className="flex items-center gap-4 py-4">
                <UserAvatar user={user} size="lg" />
                <div className="flex-1 text-left">
                  <p className="text-[22px] font-extrabold text-[#6b5b63]">{user.name}</p>
                  <p className="mt-1 text-[13px] text-[#a8949c]">
                    {t('leftFootprints')}{' '}
                    <span className="font-extrabold text-[#ff9ebb]">{count}</span>{' '}
                    {t('footprintsUnit')}
                  </p>
                </div>
              </GlassBubble>
            </motion.div>
          );
        })}
      </div>
    </SubPageShell>
  );
}
