'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SubPageShell from '@/components/SubPageShell';
import PostBubbleCard from '@/components/PostBubbleCard';
import GlassBubble from '@/components/GlassBubble';
import { LittleWorldPost } from '@/lib/types';
import { loadLittleWorld, addLittleWorldPost, createLittleWorldPost } from '@/lib/postsStorage';
import { useLocale } from '@/components/LocaleProvider';

interface LittleWorldPageProps {
  onBack: () => void;
}

export default function LittleWorldPage({ onBack }: LittleWorldPageProps) {
  const { t, locale } = useLocale();
  const [posts, setPosts] = useState<LittleWorldPost[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [text, setText] = useState('');
  const [selected, setSelected] = useState<LittleWorldPost | null>(null);

  useEffect(() => {
    loadLittleWorld().then((list) =>
      setPosts(list.sort((a, b) => b.timestamp - a.timestamp))
    );
  }, []);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    const post = createLittleWorldPost(text, locale);
    await addLittleWorldPost(post);
    setPosts((prev) => [post, ...prev].sort((a, b) => b.timestamp - a.timestamp));
    setText('');
    setShowCompose(false);
  };

  return (
    <SubPageShell title={t('littleWorldTitle')} onBack={onBack}>
      <div className="flex h-full flex-col pb-24">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
          {posts.length === 0 ? (
            <GlassBubble variant="lavender" className="py-10 text-center">
              <p className="text-[14px] text-[#a8949c]">{t('littleWorldEmpty')}</p>
            </GlassBubble>
          ) : (
            posts.map((p, i) => (
              <PostBubbleCard
                key={p.id ? `lw-${p.id}` : `lw-${i}`}
                text={p.text}
                timestamp={p.timestamp}
                variant="lavender"
                anonymous
                onClick={() => setSelected(p)}
              />
            ))
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
            <GlassBubble variant="lavender" className="py-3.5 text-center">
              <span className="text-[14px] font-bold text-[#7a6b8b]">
                {t('littleWorldPrompt')}
              </span>
            </GlassBubble>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showCompose && (
          <motion.div
            key="little-world-compose"
            className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center echo-overlay px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCompose(false)}
          >
            <motion.div
              className="macaron-glass-card w-full max-w-md rounded-[28px] p-6"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassBubble variant="lavender" className="mb-4 py-2 px-3">
                <p className="text-[15px] font-bold text-[#6b5b63]">
                  {t('littleWorldComposeTitle')}
                </p>
                <p className="text-[12px] text-[#a8949c]">{t('littleWorldAnonymous')}</p>
              </GlassBubble>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t('littleWorldPlaceholder')}
                rows={5}
                className="macaron-input-bubble mb-4 w-full resize-none bg-transparent text-[15px] text-[#6b5b63] outline-none"
              />
              <motion.button
                type="button"
                onClick={handleSubmit}
                className="macaron-btn-pink w-full py-3 text-[15px] font-bold text-white"
                whileTap={{ scale: 0.95 }}
              >
                {t('littleWorldSend')}
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {selected && (
          <motion.div
            key={`little-world-detail-${selected.id}`}
            className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center echo-overlay px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="macaron-glass-card w-full max-w-md max-h-[80vh] overflow-y-auto rounded-[28px] p-6"
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassBubble variant="lavender" className="mb-4">
                <p className="mb-2 text-[11px] font-bold text-[#c4a8e8]">
                  {t('littleWorldAnonymous')}
                </p>
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-[#6b5b63]">
                  {selected.text}
                </p>
                <p className="mt-3 text-right text-[10px] text-[#c4b0b8]">
                  {selected.createdAt}
                </p>
              </GlassBubble>
              <motion.button
                type="button"
                onClick={() => setSelected(null)}
                className="macaron-btn-blue w-full py-2.5 text-[14px] font-bold text-white"
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
