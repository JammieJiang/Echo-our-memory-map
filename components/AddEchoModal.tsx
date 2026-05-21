'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, ImagePlus, X, Pencil, Calendar } from 'lucide-react';
import { Echo } from '@/lib/types';
import { getUsersWithStoredAvatars, saveUserAvatar } from '@/lib/mockData';
import { resolveCoordinates, getQuickCitySuggestions } from '@/lib/geocode';
import { PlaceSuggestion } from '@/lib/types';
import PlaceAutocomplete from '@/components/PlaceAutocomplete';
import { formatEchoDate } from '@/lib/i18n';
import UserAvatar from '@/components/UserAvatar';
import GlassBubble, { GlassField } from '@/components/GlassBubble';
import { useLocale } from '@/components/LocaleProvider';
import { resolveImageUrl } from '@/lib/cloud/client';

interface AddEchoModalProps {
  onClose: () => void;
  onAdd: (echo: Echo) => void | Promise<void>;
}

const MAX_PHOTO_BYTES = 4 * 1024 * 1024;

const USER_RING: Record<string, string> = {
  '1': 'ring-[#ffb8d0] shadow-[0_0_0_3px_rgba(255,184,208,0.45)]',
  '2': 'ring-[#8ecdf5] shadow-[0_0_0_3px_rgba(142,205,245,0.45)]',
  '3': 'ring-[#ffe9a8] shadow-[0_0_0_3px_rgba(255,233,168,0.5)]',
};

export default function AddEchoModal({ onClose, onAdd }: AddEchoModalProps) {
  const { t, locale } = useLocale();
  const [users, setUsers] = useState(() => getUsersWithStoredAvatars());
  const [userId, setUserId] = useState(users[0].id);
  const [placeName, setPlaceName] = useState('');
  const [placeSelection, setPlaceSelection] = useState<PlaceSuggestion | null>(null);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [echoDate, setEchoDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const [avatarEditUserId, setAvatarEditUserId] = useState<string | null>(null);

  const handleAvatarFile = (file: File | undefined) => {
    if (!file || !avatarEditUserId) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > MAX_PHOTO_BYTES) {
      setError(t('avatarTooBig'));
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      await saveUserAvatar(avatarEditUserId, reader.result as string);
      setUsers(getUsersWithStoredAvatars());
      setAvatarEditUserId(null);
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError(t('pickImage'));
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError(t('imageTooBig'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const selectedUser = users.find((u) => u.id === userId);
    if (!selectedUser) return;
    if (!placeName.trim() || !description.trim()) {
      setError(t('fillAll'));
      return;
    }
    setSubmitting(true);
    try {
      const coords = await resolveCoordinates(
        placeName.trim(),
        placeSelection
          ? { lat: placeSelection.lat, lng: placeSelection.lng }
          : undefined
      );
      if (!coords) {
        setError(t('cityNotFound'));
        return;
      }
      let photoUrl: string | undefined;
      if (photo) {
        photoUrl = await resolveImageUrl(photo);
      }
      const dateObj = new Date(`${echoDate}T12:00:00`);
      await onAdd({
        id: Date.now().toString(),
        userId,
        userName: selectedUser.name,
        userAvatar: selectedUser.avatar,
        latitude: coords.lat,
        longitude: coords.lng,
        placeName: placeName.trim(),
        description: description.trim(),
        photos: photoUrl ? [photoUrl] : [],
        timestamp: dateObj.getTime(),
        createdAt: formatEchoDate(dateObj.getTime(), locale),
      });
    } catch {
      setError(t('cloudUploadFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-[16px] border-2 border-white/90 bg-white/70 px-3 py-2.5 text-[15px] text-[#6b5b63] outline-none focus:border-[#ffb8d0] focus:ring-2 focus:ring-[#ffd6e8]';

  return (
    <motion.div
      key="add-echo-modal"
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center echo-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="macaron-glass-card echo-modal-sheet w-full sm:max-w-md max-h-[92vh] overflow-y-auto p-6 sm:p-7"
        initial={{ y: 80, opacity: 0, scale: 0.94 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 340, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <GlassBubble variant="pink" className="py-2 px-4 inline-block">
            <h2 className="text-[18px] font-extrabold text-[#6b5b63]">{t('recordEchoTitle')}</h2>
          </GlassBubble>
          <motion.button
            type="button"
            onClick={onClose}
            className="macaron-btn-soft flex h-10 w-10 items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={t('close')}
          >
            <X className="h-5 w-5 text-[#a8949c]" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <GlassField label={t('whoRecords')} variant="blue">
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                handleAvatarFile(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
            <div className="flex gap-2">
              {users.map((user) => (
                <div key={user.id} className="relative flex-1">
                  <motion.button
                    type="button"
                    onClick={() => setUserId(user.id)}
                    className={`flex w-full flex-col items-center gap-2 rounded-[20px] border-2 bg-white/80 py-3 ${
                      userId === user.id ? USER_RING[user.id] : 'border-transparent opacity-75'
                    }`}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <UserAvatar user={user} size="md" />
                    <span className="text-[13px] font-bold text-[#6b5b63]">{user.name}</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    title="换头像"
                    onClick={() => {
                      setAvatarEditUserId(user.id);
                      avatarRef.current?.click();
                    }}
                    className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full macaron-btn-pink"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Pencil className="h-3 w-3 text-white" />
                  </motion.button>
                </div>
              ))}
            </div>
          </GlassField>

          <GlassField label={t('onePhoto')} variant="yellow">
            <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={(e) => { handlePhotoFile(e.target.files?.[0]); e.target.value = ''; }} />
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { handlePhotoFile(e.target.files?.[0]); e.target.value = ''; }} />
            {photo ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border-2 border-white">
                <img src={photo} alt="预览" className="h-full w-full object-cover" />
                <motion.button type="button" onClick={() => setPhoto(null)} className="absolute right-2 top-2 macaron-btn-soft px-3 py-1 text-[12px] font-bold" whileTap={{ scale: 0.95 }}>
                  {t('removePhoto')}
                </motion.button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <motion.button type="button" onClick={() => galleryRef.current?.click()} className="macaron-btn-soft flex items-center justify-center gap-2 py-4 text-[14px] font-bold text-[#6b5b63]" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <ImagePlus className="h-4 w-4" /> {t('gallery')}
                </motion.button>
                <motion.button type="button" onClick={() => cameraRef.current?.click()} className="macaron-btn-soft flex items-center justify-center gap-2 py-4 text-[14px] font-bold text-[#6b5b63]" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Camera className="h-4 w-4" /> {t('takePhoto')}
                </motion.button>
              </div>
            )}
          </GlassField>

          <GlassField label={t('thisDay')} variant="blue">
            <div className="macaron-input-bubble flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0 text-[#8ecdf5]" />
              <input
                type="date"
                value={echoDate}
                onChange={(e) => setEchoDate(e.target.value)}
                className="w-full bg-transparent text-[15px] font-bold text-[#6b5b63] outline-none [color-scheme:light]"
              />
            </div>
          </GlassField>

          <GlassField label={t('cityPlace')} variant="white">
            <PlaceAutocomplete
              value={placeName}
              onChange={setPlaceName}
              onSelect={setPlaceSelection}
              selected={placeSelection}
              inputClassName={inputClass}
            />
            <p className="mt-1.5 text-[11px] text-[#c4b0b8]">{t('citySearchHint')}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {getQuickCitySuggestions().map((city, i) => (
                <motion.button
                  key={`quick-city-${i}-${city}`}
                  type="button"
                  onClick={() => {
                    setPlaceSelection(null);
                    setPlaceName((prev) => {
                      const suffix = prev.includes('·') ? prev.split('·')[1]?.trim() : '';
                      return suffix ? `${city} · ${suffix}` : `${city} · `;
                    });
                  }}
                  className="echo-chip"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                >
                  {city}
                </motion.button>
              ))}
            </div>
          </GlassField>

          <GlassField label={t('message')} variant="pink">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('messagePlaceholder')} rows={4} className={`${inputClass} resize-none`} />
          </GlassField>

          {error && (
            <GlassBubble variant="pink">
              <p className="text-center text-[13px] font-medium text-[#ff8a9b]">{error}</p>
            </GlassBubble>
          )}

          <motion.button
            type="submit"
            disabled={submitting}
            className="macaron-btn-pink w-full py-3.5 text-[15px] font-bold disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {submitting ? t('cloudSaving') : t('sendEcho')}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
