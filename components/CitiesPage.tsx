'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import SubPageShell from '@/components/SubPageShell';
import GlassBubble from '@/components/GlassBubble';
import { CITY_CATALOG, extractCityZh } from '@/lib/cities';
import { useLocale } from '@/components/LocaleProvider';
import { Echo } from '@/lib/types';

interface CitiesPageProps {
  echoes: Echo[];
  onBack: () => void;
}

export default function CitiesPage({ echoes, onBack }: CitiesPageProps) {
  const { t, locale } = useLocale();

  const echoCities = useMemo(() => {
    const set = new Set<string>();
    echoes.forEach((e) => set.add(extractCityZh(e.placeName)));
    return set;
  }, [echoes]);

  const list = useMemo(() => {
    const fromEchoes = [...echoCities]
      .filter((zh) => !CITY_CATALOG.some((c) => c.zh === zh))
      .map((zh) => ({
        zh,
        en: zh,
        count: echoes.filter((e) => extractCityZh(e.placeName) === zh).length,
      }));

    return [
      ...CITY_CATALOG.map((c) => ({
        ...c,
        count: echoes.filter((e) => extractCityZh(e.placeName) === c.zh).length,
      })),
      ...fromEchoes,
    ];
  }, [echoes, echoCities]);

  return (
    <SubPageShell title={t('citiesTitle')} onBack={onBack}>
      <div className="macaron-glass-card h-full overflow-hidden rounded-[28px] border-2 border-white/90 p-3">
        <div className="h-full space-y-2.5 overflow-y-auto scroll-smooth pr-1">
          {list.map((city, i) => (
            <motion.div
              key={city.zh ? `city-${city.zh}` : `city-extra-${i}`}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.4) }}
            >
              <GlassBubble
                variant={city.count > 0 ? (['pink', 'blue', 'yellow'] as const)[i % 3] : 'white'}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="text-[16px] font-extrabold text-[#6b5b63]">
                    {locale === 'en' ? city.en : city.zh}
                  </p>
                  <p className="text-[13px] text-[#a8949c]">
                    {locale === 'en' ? city.zh : city.en}
                  </p>
                </div>
                {city.count > 0 && (
                  <span className="shrink-0 rounded-full border border-[#ffd6e8] bg-white/80 px-2.5 py-1 text-[11px] font-bold text-[#ff9ebb]">
                    {city.count}
                  </span>
                )}
              </GlassBubble>
            </motion.div>
          ))}
        </div>
      </div>
    </SubPageShell>
  );
}
