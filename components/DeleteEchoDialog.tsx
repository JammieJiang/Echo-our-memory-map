'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import GlassBubble from '@/components/GlassBubble';
import { LOGIN_PASSWORD } from '@/lib/mockData';
import { useLocale } from '@/components/LocaleProvider';

interface DeleteEchoDialogProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteEchoDialog({ onCancel, onConfirm }: DeleteEchoDialogProps) {
  const { t } = useLocale();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== LOGIN_PASSWORD) {
      setError(t('wrongPasswordDelete'));
      setPassword('');
      return;
    }
    onConfirm();
  };

  return (
    <motion.div
      key="delete-echo-dialog"
      className="fixed inset-0 z-[70] flex items-center justify-center echo-overlay px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="macaron-glass-card relative w-full max-w-sm p-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <GlassBubble variant="pink" className="mb-4 text-center">
          <p className="text-[15px] font-bold text-[#6b5b63]">{t('deleteConfirm')}</p>
          <p className="mt-1 text-[13px] text-[#a8949c]">{t('enterPasswordDelete')}</p>
        </GlassBubble>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="macaron-input-bubble">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('passwordPlaceholder')}
              className="w-full bg-transparent text-[15px] text-[#6b5b63] outline-none"
              autoFocus
            />
          </div>
          {error && (
            <p className="text-center text-[13px] font-medium text-[#ff8a9b]">{error}</p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              type="button"
              onClick={onCancel}
              className="macaron-btn-soft py-2.5 text-[14px] font-bold text-[#6b5b63]"
              whileTap={{ scale: 0.95 }}
            >
              {t('cancel')}
            </motion.button>
            <motion.button
              type="submit"
              className="macaron-btn-pink py-2.5 text-[14px] font-bold text-white"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('confirmDelete')}
            </motion.button>
          </div>
        </form>
        <motion.button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center macaron-btn-soft"
          whileTap={{ scale: 0.95 }}
          aria-label="Close"
        >
          <X className="h-4 w-4 text-[#a8949c]" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
