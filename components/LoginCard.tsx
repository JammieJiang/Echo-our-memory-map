'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Sparkles } from 'lucide-react';
import { LOGIN_PASSWORD } from '@/lib/mockData';
import { useLocale } from '@/components/LocaleProvider';

interface LoginCardProps {
  onEnter: () => void;
}

export default function LoginCard({ onEnter }: LoginCardProps) {
  const { t } = useLocale();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [phase, setPhase] = useState<'idle' | 'bursting'>('idle');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== LOGIN_PASSWORD) {
      setError(t('wrongPassword'));
      setPassword('');
      return;
    }
    setError('');
    setPhase('bursting');
    localStorage.setItem('isLoggedIn', 'true');
    setTimeout(() => onEnter(), 580);
  };

  return (
    <motion.div
      className="relative z-10 flex min-h-screen w-full items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="macaron-glass-card w-full max-w-md p-8 text-center"
        initial={{ opacity: 0, y: 28, scale: 0.92 }}
        animate={
          phase === 'bursting'
            ? {
                scale: [1, 1.22, 0.4],
                opacity: [1, 0.95, 0],
                filter: ['blur(0px)', 'blur(0px)', 'blur(12px)'],
              }
            : { opacity: 1, y: [0, -8, 0], scale: 1 }
        }
        transition={
          phase === 'bursting'
            ? { duration: 0.58, times: [0, 0.38, 1], ease: 'easeInOut' }
            : {
                y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 0.7 },
                scale: { type: 'spring', stiffness: 200, damping: 18 },
              }
        }
      >
        <motion.p
          className="mb-2 text-4xl"
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          aria-hidden
        >
          🐏 🐕 🐇
        </motion.p>
        <h1 className="mb-1 text-[28px] font-extrabold tracking-wide text-[#6b5b63]">
          {t('appTitle')}
        </h1>
        <p className="mb-8 text-[14px] text-[#a8949c]">{t('loginHint')}</p>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div className="macaron-input-bubble">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('passwordPlaceholder')}
              className="w-full bg-transparent text-[15px] text-[#6b5b63] outline-none placeholder:text-[#c4b0b8]"
              disabled={phase === 'bursting'}
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-[13px] font-medium text-[#ff8a9b]"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={phase === 'bursting'}
            className="macaron-btn-pink flex w-full items-center justify-center gap-2 py-3.5 text-[15px] font-bold text-white disabled:opacity-60"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Globe className="h-5 w-5" strokeWidth={2.2} />
            {t('enterEarth')}
            <Sparkles className="h-4 w-4 opacity-90" />
          </motion.button>
        </form>

        <p className="mt-6 text-[12px] text-[#c4b0b8]">{t('loginFooter')}</p>
      </motion.div>

      {phase === 'bursting' &&
        [0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-[#ffb8d0]"
            initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 1 }}
            animate={{
              x: `calc(-50% + ${Math.cos((i / 5) * Math.PI * 2) * 80}px)`,
              y: `calc(-50% + ${Math.sin((i / 5) * Math.PI * 2) * 80}px)`,
              scale: [0, 1.2, 0],
              opacity: [1, 0.8, 0],
            }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />
        ))}
    </motion.div>
  );
}
