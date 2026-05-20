'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type Variant = 'pink' | 'blue' | 'yellow' | 'white' | 'lavender';

const variantClass: Record<Variant, string> = {
  pink: 'bg-white/82 border-[#ffd6e8] shadow-[0_8px_32px_rgba(255,158,187,0.22)]',
  blue: 'bg-white/82 border-[#c8e8ff] shadow-[0_8px_32px_rgba(142,205,245,0.22)]',
  yellow: 'bg-white/88 border-[#ffe9a8] shadow-[0_8px_32px_rgba(255,220,120,0.2)]',
  white: 'bg-white/90 border-white shadow-[0_8px_28px_rgba(200,160,180,0.15)]',
  lavender:
    'bg-white/85 border-[#e8d4ff] shadow-[0_8px_28px_rgba(196,168,232,0.28)]',
};

interface GlassBubbleProps {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  animate?: boolean;
}

export default function GlassBubble({
  children,
  className = '',
  variant = 'white',
  animate = false,
}: GlassBubbleProps) {
  const inner = (
    <div
      className={`rounded-[22px] border-2 backdrop-blur-xl px-4 py-3 ${variantClass[variant]} ${className}`}
    >
      {children}
    </div>
  );

  if (!animate) return inner;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
    >
      {inner}
    </motion.div>
  );
}

/** 表单字段：标签 + 输入都在气泡内，避免与背景混在一起 */
export function GlassField({
  label,
  children,
  variant = 'white' as Variant,
}: {
  label: string;
  children: ReactNode;
  variant?: Variant;
}) {
  return (
    <GlassBubble variant={variant} className="space-y-2.5">
      <span className="block text-[13px] font-bold text-[#8b7280]">{label}</span>
      {children}
    </GlassBubble>
  );
}
