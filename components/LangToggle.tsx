'use client';

import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { useLocale } from '@/components/LocaleProvider';

interface LangToggleProps {
  className?: string;
}

export default function LangToggle({ className = '' }: LangToggleProps) {
  const { locale, setLocale, t } = useLocale();

  return (
    <motion.button
      type="button"
      onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
      className={`macaron-btn-soft inline-flex items-center gap-1.5 px-3 py-2 text-[12px] font-bold text-[#6b5b63] shadow-sm ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={locale === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      <Languages className="h-3.5 w-3.5 text-[#8ecdf5]" />
      {t('langToggle')}
    </motion.button>
  );
}
