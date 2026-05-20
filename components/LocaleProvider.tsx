'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Locale,
  TranslationKey,
  translations,
  getStoredLocale,
  storeLocale,
} from '@/lib/i18n';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLocaleState(getStoredLocale());
    setReady(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    storeLocale(next);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[locale][key],
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  if (!ready) return null;

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
