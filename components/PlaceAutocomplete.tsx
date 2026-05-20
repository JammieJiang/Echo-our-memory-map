'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchPlaces } from '@/lib/placeSearch';
import { PlaceSuggestion } from '@/lib/types';
import { useLocale } from '@/components/LocaleProvider';

interface PlaceAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (suggestion: PlaceSuggestion | null) => void;
  selected: PlaceSuggestion | null;
  inputClassName?: string;
  placeholder?: string;
}

export default function PlaceAutocomplete({
  value,
  onChange,
  onSelect,
  selected,
  inputClassName = '',
  placeholder,
}: PlaceAutocompleteProps) {
  const { t } = useLocale();
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim() || value.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    if (selected && selected.placeName === value) {
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const results = await searchPlaces(value);
      setSuggestions(results);
      setOpen(results.length > 0);
      setLoading(false);
    }, 380);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, selected]);

  const pick = (s: PlaceSuggestion) => {
    onSelect(s);
    onChange(s.placeName);
    setOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onSelect(null);
          onChange(e.target.value);
        }}
        onFocus={() => {
          if (suggestions.length) setOpen(true);
        }}
        placeholder={placeholder ?? t('cityPlaceholder')}
        className={inputClassName}
        autoComplete="off"
      />
      {loading && (
        <span className="absolute right-3 top-3 text-[11px] text-[#a8949c]">
          …
        </span>
      )}
      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.ul
            key="place-suggestions"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-[16px] border-2 border-[#ffd6e8] bg-white/95 py-1 shadow-[0_8px_24px_rgba(200,160,180,0.2)]"
          >
            {suggestions.map((s, i) => (
              <li key={s.id ? `place-${s.id}` : `place-fallback-${i}-${s.label}`}>
                <button
                  type="button"
                  className="w-full px-3 py-2.5 text-left text-[13px] font-medium text-[#6b5b63] hover:bg-[#fff5f9]"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pick(s);
                  }}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
