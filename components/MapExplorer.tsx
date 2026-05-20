'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe2, Map, PenLine, Sparkles } from 'lucide-react';
import GlassBubble from '@/components/GlassBubble';
import { useLocale } from '@/components/LocaleProvider';
import { Echo } from '@/lib/types';

const Globe3D = dynamic(() => import('@/components/Globe3D'), {
  ssr: false,
  loading: () => <MapLoading kind="globe" />,
});

const FlatMap = dynamic(() => import('@/components/FlatMap'), {
  ssr: false,
  loading: () => <MapLoading kind="map" />,
});

function MapLoading({ kind }: { kind: 'globe' | 'map' }) {
  const { t } = useLocale();
  return (
    <div className="flex h-full items-center justify-center text-[14px] text-[#a8949c]">
      {kind === 'globe' ? t('loadingGlobe') : t('loadingMap')}
    </div>
  );
}

export type MapMode = 'globe' | 'flat';

interface MapExplorerProps {
  echoes: Echo[];
  onSelectEcho: (echo: Echo) => void;
  onPickRandomEcho: () => void;
  onAddEcho: () => void;
}

export default function MapExplorer({
  echoes,
  onSelectEcho,
  onPickRandomEcho,
  onAddEcho,
}: MapExplorerProps) {
  const { t } = useLocale();
  const [mode, setMode] = useState<MapMode>('globe');

  return (
    <div className="relative h-full w-full">
      <AnimatePresence mode="wait">
        {mode === 'globe' ? (
          <motion.div
            key="globe"
            className="absolute inset-0"
            initial={{ opacity: 0, rotateY: -8 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          >
            <Globe3D echoes={echoes} onSelectEcho={onSelectEcho} />
          </motion.div>
        ) : (
          <motion.div
            key="flat"
            className="absolute inset-0"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          >
            <FlatMap echoes={echoes} onSelectEcho={onSelectEcho} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute top-14 right-5 z-20 flex rounded-full border-2 border-white/90 bg-white/75 p-1 shadow-[0_6px_20px_rgba(200,160,180,0.2)] backdrop-blur-md"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.button
          type="button"
          onClick={() => setMode('globe')}
          className={`flex items-center gap-1 rounded-full px-3 py-2 text-[12px] font-bold ${
            mode === 'globe' ? 'macaron-btn-pink text-white' : 'text-[#a8949c]'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <Globe2 className="h-3.5 w-3.5" />
          {t('globe3d')}
        </motion.button>
        <motion.button
          type="button"
          onClick={() => setMode('flat')}
          className={`flex items-center gap-1 rounded-full px-3 py-2 text-[12px] font-bold ${
            mode === 'flat' ? 'macaron-btn-blue text-white' : 'text-[#a8949c]'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <Map className="h-3.5 w-3.5" />
          {t('mapFlat')}
        </motion.button>
      </motion.div>

      <div className="absolute bottom-8 left-6 z-20 flex flex-col items-start gap-2">
        <motion.button
          type="button"
          onClick={onPickRandomEcho}
          className="text-left"
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          <GlassBubble variant="lavender" className="max-w-[160px] cursor-pointer py-2.5 px-3.5">
            <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#7a6b8b]">
              <Sparkles className="h-3.5 w-3.5 text-[#c4a8e8]" />
              {t('pickEcho')}
            </span>
          </GlassBubble>
        </motion.button>

        <GlassBubble variant="white" className="max-w-[160px] py-2.5 text-[12px] text-[#a8949c]">
          <span className="font-extrabold text-[#ff9ebb]">{echoes.length}</span>{' '}
          {t('footprintCount')}
        </GlassBubble>
      </div>

      <motion.button
        type="button"
        onClick={onAddEcho}
        className="absolute bottom-8 right-6 z-20 flex h-14 w-14 items-center justify-center rounded-full macaron-btn-pink shadow-lg"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label={t('recordEcho')}
      >
        <PenLine className="h-6 w-6 text-white" />
      </motion.button>
    </div>
  );
}
