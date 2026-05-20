'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, PenLine, LogOut, Footprints, Users, Building2, Sparkles, MessageCircle } from 'lucide-react';
import LittleWorldPage from '@/components/LittleWorldPage';
import BBMachinePage from '@/components/BBMachinePage';
import AddEchoModal from '@/components/AddEchoModal';
import EchoDetail from '@/components/EchoDetail';
import FootprintsPage from '@/components/FootprintsPage';
import FriendsPage from '@/components/FriendsPage';
import CitiesPage from '@/components/CitiesPage';
import DeleteEchoDialog from '@/components/DeleteEchoDialog';
import MapExplorer from '@/components/MapExplorer';
import { EchoBackgroundBlobs, FloatingCloudDecorations } from '@/components/EchoDecor';
import GlassBubble from '@/components/GlassBubble';
import { useLocale } from '@/components/LocaleProvider';
import { Echo } from '@/lib/types';
import { MOCK_ECHOES, migrateEchoes } from '@/lib/mockData';

type AppView =
  | 'hub'
  | 'map'
  | 'footprints'
  | 'friends'
  | 'cities'
  | 'littleWorld'
  | 'bbMachine';

interface EchoAppProps {
  onLogout: () => void;
}

export default function EchoApp({ onLogout }: EchoAppProps) {
  const { t } = useLocale();
  const [view, setView] = useState<AppView>('hub');
  const [showAddModal, setShowAddModal] = useState(false);
  const [echoes, setEchoes] = useState<Echo[]>(MOCK_ECHOES);
  const [selectedEcho, setSelectedEcho] = useState<Echo | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Echo | null>(null);

  const persist = useCallback((list: Echo[]) => {
    setEchoes(list);
    localStorage.setItem('echoes', JSON.stringify(list));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('echoes');
    if (saved) {
      try {
        persist(migrateEchoes(JSON.parse(saved)));
      } catch {
        console.error('Failed to load echoes');
      }
    }
  }, [persist]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    onLogout();
  };

  const handleAddEcho = (newEcho: Echo) => {
    persist([...echoes, newEcho]);
    setShowAddModal(false);
    setView('map');
  };

  const handlePickRandomEcho = () => {
    if (echoes.length === 0) {
      setShowAddModal(true);
      return;
    }
    const random = echoes[Math.floor(Math.random() * echoes.length)];
    setSelectedEcho(random);
    setShowDetail(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    persist(echoes.filter((e) => e.id !== deleteTarget.id));
    setDeleteTarget(null);
    if (selectedEcho?.id === deleteTarget.id) {
      setShowDetail(false);
      setSelectedEcho(null);
    }
  };

  const cityCount = new Set(
    echoes.map((e) => e.placeName.split(/[·•]/)[0]?.trim()).filter(Boolean)
  ).size;

  const statItems = [
    { key: 'footprints' as const, value: echoes.length, label: t('footprints'), color: 'text-[#ff9ebb]', icon: Footprints },
    { key: 'friends' as const, value: 3, label: t('friends'), color: 'text-[#8ecdf5]', icon: Users },
    { key: 'cities' as const, value: cityCount, label: t('cities'), color: 'text-[#e8c060]', icon: Building2 },
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <EchoBackgroundBlobs />

      <AnimatePresence mode="wait">
        {view === 'hub' && (
          <motion.div
            key="hub"
            className="echo-page-bg relative z-10 flex h-full items-center justify-center px-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          >
            <FloatingCloudDecorations />
            <GlassBubble variant="pink" animate className="relative z-10 max-w-lg w-full p-10 text-center">
              <p className="mb-3 text-3xl tracking-widest" aria-hidden>🐏 🐕 🐇</p>
              <h1 className="mb-2 text-[32px] font-extrabold text-[#6b5b63]">{t('appTitle')}</h1>
              <p className="mb-10 text-[15px] leading-relaxed text-[#a8949c]">{t('tagline')}</p>

              <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <motion.button
                  type="button"
                  onClick={() => setView('map')}
                  className="macaron-btn-blue flex items-center justify-center gap-2 py-4 px-5 text-[15px] font-bold text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MapPin className="h-5 w-5" />
                  {t('findEcho')}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="macaron-btn-pink flex items-center justify-center gap-2 py-4 px-5 text-[15px] font-bold text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PenLine className="h-5 w-5" />
                  {t('recordEcho')}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setView('littleWorld')}
                  className="macaron-btn-soft flex items-center justify-center gap-2 py-3.5 px-4 text-[14px] font-bold text-[#7a6b8b]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles className="h-4 w-4 text-[#c4a8e8]" />
                  {t('littleWorld')}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setView('bbMachine')}
                  className="macaron-btn-soft flex items-center justify-center gap-2 py-3.5 px-4 text-[14px] font-bold text-[#6b5b63]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageCircle className="h-4 w-4 text-[#8ecdf5]" />
                  {t('bbMachine')}
                </motion.button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {statItems.map((item) => (
                  <motion.button
                    key={item.key}
                    type="button"
                    onClick={() => setView(item.key)}
                    className="rounded-[20px] border-2 border-white/80 bg-white/50 py-4 text-center backdrop-blur-sm"
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <item.icon className={`mx-auto mb-1 h-5 w-5 ${item.color}`} />
                    <div className={`text-[22px] font-extrabold ${item.color}`}>{item.value}</div>
                    <div className="text-[11px] font-bold text-[#a8949c]">{item.label}</div>
                  </motion.button>
                ))}
              </div>

              <motion.button
                type="button"
                onClick={handleLogout}
                className="mt-6 inline-flex items-center gap-1 text-[13px] text-[#a8949c]"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <LogOut className="h-3.5 w-3.5" />
                {t('logout')}
              </motion.button>
            </GlassBubble>
          </motion.div>
        )}

        {view === 'map' && (
          <motion.div
            key="map"
            className="relative z-10 h-full w-full"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            <FloatingCloudDecorations />
            <div className="relative z-[2] h-full w-full">
            <MapExplorer
              echoes={echoes}
              onSelectEcho={(e) => {
                setSelectedEcho(e);
                setShowDetail(true);
              }}
              onPickRandomEcho={handlePickRandomEcho}
              onAddEcho={() => setShowAddModal(true)}
            />
            <motion.button
              type="button"
              onClick={() => setView('hub')}
              className="absolute top-5 left-5 z-30 macaron-btn-soft inline-flex items-center gap-1 px-4 py-2.5 text-[14px] font-bold text-[#6b5b63]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('backHome')}
            </motion.button>
            </div>
          </motion.div>
        )}

        {view === 'footprints' && (
          <FootprintsPage
            key="footprints"
            echoes={echoes}
            onBack={() => setView('hub')}
            onSelectEcho={(e) => {
              setSelectedEcho(e);
              setShowDetail(true);
            }}
            onRequestDelete={setDeleteTarget}
          />
        )}

        {view === 'friends' && (
          <FriendsPage key="friends" echoes={echoes} onBack={() => setView('hub')} />
        )}

        {view === 'cities' && (
          <CitiesPage key="cities" echoes={echoes} onBack={() => setView('hub')} />
        )}

        {view === 'littleWorld' && (
          <LittleWorldPage key="littleWorld" onBack={() => setView('hub')} />
        )}

        {view === 'bbMachine' && (
          <BBMachinePage key="bbMachine" onBack={() => setView('hub')} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddModal && (
          <AddEchoModal
            key="add-echo-modal"
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddEcho}
          />
        )}
        {showDetail && selectedEcho && (
          <EchoDetail
            key={`echo-detail-${selectedEcho.id}`}
            echo={selectedEcho}
            onClose={() => {
              setShowDetail(false);
              setSelectedEcho(null);
            }}
            onRequestDelete={() => setDeleteTarget(selectedEcho)}
          />
        )}
        {deleteTarget && (
          <DeleteEchoDialog
            key="delete-echo-dialog"
            onCancel={() => setDeleteTarget(null)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
