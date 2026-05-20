'use client';

import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { ReactNode } from 'react';
import { EchoBackgroundBlobs, FloatingCloudDecorations } from '@/components/EchoDecor';
import GlassBubble from '@/components/GlassBubble';
import { useLocale } from '@/components/LocaleProvider';

interface SubPageShellProps {
  title: string;
  onBack: () => void;
  children: ReactNode;
}

export default function SubPageShell({ title, onBack, children }: SubPageShellProps) {
  const { t } = useLocale();
  return (
    <motion.div
      className="echo-page-bg relative z-10 flex h-full flex-col"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ type: 'spring', stiffness: 300, damping: 32 }}
    >
      <EchoBackgroundBlobs />
      <FloatingCloudDecorations />
      <div className="relative z-10 flex shrink-0 items-center gap-3 px-4 pt-5 pb-3">
        <motion.button
          type="button"
          onClick={onBack}
          className="macaron-btn-soft inline-flex items-center gap-1 px-4 py-2.5 text-[14px] font-bold text-[#6b5b63]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="h-4 w-4" />
          {t('back')}
        </motion.button>
        <GlassBubble variant="pink" className="flex-1 py-2.5 px-4">
          <h1 className="text-[20px] font-extrabold text-[#6b5b63]">{title}</h1>
        </GlassBubble>
      </div>
      <div className="relative z-10 flex-1 overflow-hidden px-4 pb-6">{children}</div>
    </motion.div>
  );
}
