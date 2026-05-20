'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoginCard from '@/components/LoginCard';
import EchoApp from '@/components/EchoApp';
import LangToggle from '@/components/LangToggle';
import { EchoBackgroundBlobs } from '@/components/EchoDecor';
import LoginDecorations from '@/components/LoginDecorations';

type View = 'login' | 'app';

export default function Home() {
  const [view, setView] = useState<View>('login');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      setView('app');
    }
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="macaron-page h-screen w-screen" />;
  }

  return (
    <main className="macaron-page relative h-screen w-screen overflow-hidden">
      <LangToggle className="fixed top-5 right-5 z-[100]" />
      <EchoBackgroundBlobs />

      <AnimatePresence mode="wait">
        {view === 'login' ? (
          <motion.div
            key="login-wrap"
            className="absolute inset-0"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <LoginDecorations />
            <LoginCard onEnter={() => setView('app')} />
          </motion.div>
        ) : (
          <motion.div
            key="app-wrap"
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
          >
            <EchoApp
              onLogout={() => {
                localStorage.removeItem('isLoggedIn');
                setView('login');
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
