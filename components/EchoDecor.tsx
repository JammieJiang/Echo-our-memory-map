import type { CSSProperties } from 'react';

/** 马卡龙渐变背景光斑 */
export function EchoBackgroundBlobs() {
  return (
    <>
      <div className="echo-blob echo-blob-pink" aria-hidden />
      <div className="echo-blob echo-blob-blue" aria-hidden />
      <div className="echo-blob echo-blob-yellow" aria-hidden />
    </>
  );
}

type CloudProps = {
  className?: string;
  style?: CSSProperties;
  /** 整体透明度系数 0–1 */
  opacity?: number;
};

/** 白色半透明蓬松云朵 */
export function SoftCloud({ className = '', style, opacity = 1 }: CloudProps) {
  const fill = `rgba(255, 255, 255, ${0.42 * opacity})`;
  const stroke = `rgba(255, 255, 255, ${0.72 * opacity})`;

  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 120 72"
      fill="none"
      aria-hidden
    >
      <circle cx="34" cy="44" r="22" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <circle cx="58" cy="36" r="26" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <circle cx="82" cy="44" r="20" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <circle cx="48" cy="52" r="18" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <circle cx="72" cy="50" r="16" fill={fill} stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

const CLOUD_SLOTS: {
  className: string;
  opacity: number;
  delay: string;
  duration: string;
}[] = [
  { className: 'absolute top-[8%] left-[5%] w-[100px] sm:w-[120px]', opacity: 0.85, delay: '0s', duration: '7s' },
  { className: 'absolute top-[18%] right-[8%] w-[88px] sm:w-[108px]', opacity: 0.75, delay: '1.2s', duration: '8s' },
  { className: 'absolute top-[42%] left-[12%] w-[72px] sm:w-[88px]', opacity: 0.65, delay: '0.6s', duration: '6.5s' },
  { className: 'absolute top-[38%] right-[14%] w-[80px] sm:w-[96px]', opacity: 0.7, delay: '2s', duration: '9s' },
  { className: 'absolute bottom-[22%] left-[8%] w-[96px] sm:w-[116px]', opacity: 0.8, delay: '0.4s', duration: '7.5s' },
  { className: 'absolute bottom-[16%] right-[10%] w-[84px] sm:w-[104px]', opacity: 0.72, delay: '1.6s', duration: '8.5s' },
  { className: 'absolute bottom-[38%] right-[32%] w-[64px] sm:w-[76px]', opacity: 0.55, delay: '2.4s', duration: '10s' },
];

/** 漂浮的白色透色云朵 — 登录页与登录后各页共用 */
export function FloatingCloudDecorations() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
      {CLOUD_SLOTS.map((slot, i) => (
        <SoftCloud
          key={`cloud-${i}`}
          className={slot.className}
          opacity={slot.opacity}
          style={{
            animation: `float-doodle ${slot.duration} ease-in-out infinite`,
            animationDelay: slot.delay,
          }}
        />
      ))}
    </div>
  );
}

/** @deprecated 使用 FloatingCloudDecorations */
export function HomeDecorations() {
  return <FloatingCloudDecorations />;
}
