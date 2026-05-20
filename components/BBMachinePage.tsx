'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SubPageShell from '@/components/SubPageShell';
import PostBubbleCard from '@/components/PostBubbleCard';
import GlassBubble from '@/components/GlassBubble';
import UserAvatar from '@/components/UserAvatar';
import { BBPost } from '@/lib/types';
import { getUsersWithStoredAvatars, USERS } from '@/lib/mockData';
import { loadBBPosts, saveBBPosts, createBBPost } from '@/lib/postsStorage';
import { useLocale } from '@/components/LocaleProvider';

const MAX_BYTES = 4 * 1024 * 1024;

interface BBMachinePageProps {
  onBack: () => void;
}

export default function BBMachinePage({ onBack }: BBMachinePageProps) {
  const { t, locale } = useLocale();
  const [posts, setPosts] = useState<BBPost[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [userId, setUserId] = useState('1');
  const [mode, setMode] = useState<'text' | 'screenshot'>('text');
  const [text, setText] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [selected, setSelected] = useState<BBPost | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const users = getUsersWithStoredAvatars();

  useEffect(() => {
    setPosts(loadBBPosts().sort((a, b) => b.timestamp - a.timestamp));
  }, []);

  const persist = (list: BBPost[]) => {
    setPosts(list);
    saveBBPosts(list);
  };

  const handleFile = (file?: File) => {
    if (!file?.type.startsWith('image/')) return;
    if (file.size > MAX_BYTES) return;
    const reader = new FileReader();
    reader.onload = () => setScreenshot(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const user = users.find((u) => u.id === userId) ?? users[0];
    if (mode === 'text' && !text.trim()) return;
    if (mode === 'screenshot' && !screenshot) return;

    const post = createBBPost(
      {
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        type: mode,
        text: mode === 'text' ? text.trim() : t('bbScreenshotLabel'),
        screenshot: mode === 'screenshot' ? (screenshot ?? undefined) : undefined,
      },
      locale
    );
    persist([post, ...posts]);
    setText('');
    setScreenshot(null);
    setShowCompose(false);
  };

  const variantFor = (id: string) =>
    id === '1' ? 'pink' : id === '2' ? 'blue' : 'yellow';

  return (
    <SubPageShell title={t('bbTitle')} onBack={onBack}>
      <div className="flex h-full flex-col pb-24">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
          {posts.length === 0 ? (
            <GlassBubble variant="blue" className="py-10 text-center">
              <p className="text-[14px] text-[#a8949c]">{t('bbEmpty')}</p>
            </GlassBubble>
          ) : (
            posts.map((p, i) => {
              const meta = USERS.find((u) => u.id === p.userId);
              return (
                <PostBubbleCard
                  key={p.id ? `bb-${p.id}` : `bb-${i}`}
                  text={p.type === 'screenshot' ? t('bbScreenshotPreview') : p.text}
                  timestamp={p.timestamp}
                  variant={variantFor(p.userId) as 'pink' | 'blue' | 'yellow'}
                  user={{
                    name: p.userName,
                    avatar: p.userAvatar,
                    color: meta?.color ?? '#8ecdf5',
                  }}
                  onClick={() => setSelected(p)}
                />
              );
            })
          )}
        </div>

        <div className="absolute bottom-6 left-4 right-4 z-20">
          <motion.button
            type="button"
            onClick={() => setShowCompose(true)}
            className="w-full"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <GlassBubble variant="blue" className="py-3.5 text-center">
              <span className="text-[14px] font-bold text-[#6b5b63]">{t('bbPrompt')}</span>
            </GlassBubble>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showCompose && (
          <motion.div
            key="bb-compose"
            className="fixed inset-0 z-[60] flex items-end justify-center echo-overlay px-4 pb-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCompose(false)}
          >
            <motion.div
              className="macaron-glass-card max-h-[88vh] w-full max-w-md overflow-y-auto rounded-[28px] p-6"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassBubble variant="blue" className="mb-4 py-2 px-3">
                <p className="text-[15px] font-bold text-[#6b5b63]">{t('bbComposeTitle')}</p>
              </GlassBubble>

              <p className="mb-2 text-[13px] font-bold text-[#a8949c]">{t('bbWhoSaid')}</p>
              <div className="mb-4 flex gap-2">
                {users.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setUserId(u.id)}
                    className={`flex flex-1 flex-col items-center gap-1 rounded-[16px] border-2 py-2 ${
                      userId === u.id
                        ? 'border-[#8ecdf5] bg-white/90'
                        : 'border-transparent bg-white/50'
                    }`}
                  >
                    <UserAvatar user={u} size="sm" />
                    <span className="text-[12px] font-bold">{u.name}</span>
                  </button>
                ))}
              </div>

              <div className="mb-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('text')}
                  className={`rounded-[14px] py-2.5 text-[13px] font-bold ${
                    mode === 'text' ? 'macaron-btn-blue text-white' : 'macaron-btn-soft text-[#6b5b63]'
                  }`}
                >
                  {t('bbWriteDown')}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('screenshot')}
                  className={`rounded-[14px] py-2.5 text-[13px] font-bold ${
                    mode === 'screenshot'
                      ? 'macaron-btn-blue text-white'
                      : 'macaron-btn-soft text-[#6b5b63]'
                  }`}
                >
                  {t('bbEvidence')}
                </button>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  handleFile(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />

              {mode === 'text' ? (
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t('bbTextPlaceholder')}
                  rows={4}
                  className="macaron-input-bubble mb-4 w-full resize-none bg-transparent text-[15px] outline-none"
                />
              ) : screenshot ? (
                <div className="relative mb-4 overflow-hidden rounded-[16px] border-2 border-white">
                  <img src={screenshot} alt="" className="max-h-40 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setScreenshot(null)}
                    className="absolute right-2 top-2 macaron-btn-soft px-2 py-1 text-[11px]"
                  >
                    {t('removePhoto')}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="macaron-btn-soft mb-4 w-full py-4 text-[14px] font-bold"
                >
                  {t('bbUploadScreenshot')}
                </button>
              )}

              <motion.button
                type="button"
                onClick={handleSubmit}
                className="macaron-btn-blue w-full py-3 font-bold text-white"
                whileTap={{ scale: 0.95 }}
              >
                {t('bbSend')}
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {selected && (
          <motion.div
            key={`bb-detail-${selected.id}`}
            className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center echo-overlay px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="macaron-glass-card w-full max-w-md max-h-[85vh] overflow-y-auto rounded-[28px] p-6"
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassBubble variant="blue" className="mb-4 flex items-center gap-3">
                <UserAvatar
                  user={{
                    name: selected.userName,
                    avatar: selected.userAvatar,
                    color: USERS.find((u) => u.id === selected.userId)?.color ?? '#8ecdf5',
                  }}
                  size="md"
                />
                <div>
                  <p className="font-extrabold text-[#6b5b63]">{selected.userName}</p>
                  <p className="text-[11px] text-[#c4b0b8]">{selected.createdAt}</p>
                </div>
              </GlassBubble>
              {selected.type === 'screenshot' && selected.screenshot && (
                <img
                  src={selected.screenshot}
                  alt=""
                  className="mb-4 w-full rounded-[16px] border-2 border-white object-contain"
                />
              )}
              <GlassBubble variant="white" className="mb-4">
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-[#6b5b63]">
                  {selected.text}
                </p>
              </GlassBubble>
              <motion.button
                type="button"
                onClick={() => setSelected(null)}
                className="macaron-btn-blue w-full py-2.5 font-bold text-white"
                whileTap={{ scale: 0.95 }}
              >
                {t('closePage')}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SubPageShell>
  );
}
