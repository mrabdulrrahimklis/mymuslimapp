import Image from 'next/image';
import { APP_STORE_URL, PLAY_URL } from '@/lib/stores';

const badge = 'inline-flex items-center gap-3 rounded-xl border border-white/20 bg-black px-4 py-2 text-white hover:border-noor';

const AppleIcon = () => (
  <svg viewBox="0 0 384 512" className="h-6 w-6 fill-current" aria-hidden>
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
    <path fill="#34d399" d="M3.6 1.8 13.8 12 3.6 22.2c-.4-.2-.6-.6-.6-1.1V2.9c0-.5.2-.9.6-1.1z" />
    <path fill="#fbbf24" d="m17.3 8.5-3.5 3.5 3.5 3.5 4-2.3c1.1-.6 1.1-1.8 0-2.4z" />
    <path fill="#60a5fa" d="M3.6 1.8c.3-.2.8-.2 1.3.1l12.4 6.6-3.5 3.5z" />
    <path fill="#f87171" d="m13.8 12 3.5 3.5-12.4 6.6c-.5.3-1 .3-1.3.1z" />
  </svg>
);

/** App Store and Google Play badges and, on a computer, a QR code that opens the phone's store. */
export function AppBadges({ scanLabel }: { scanLabel: string }) {
  return (
    <div id="app" className="flex flex-wrap items-center gap-4">
      <a href={APP_STORE_URL} target="_blank" rel="noopener" className={badge}>
        <AppleIcon />
        <span className="leading-tight"><span className="block text-[11px]">Download on the</span><span className="text-lg font-semibold">App Store</span></span>
      </a>
      <a href={PLAY_URL} target="_blank" rel="noopener" className={badge}>
        <PlayIcon />
        <span className="leading-tight"><span className="block text-[11px] uppercase">Get it on</span><span className="text-lg font-semibold">Google Play</span></span>
      </a>
      <div className="hidden items-center gap-4 border-s border-line ps-4 lg:flex">
        <Image src="/qr-install.svg" alt="" width={96} height={96} className="rounded-xl bg-white p-1.5" unoptimized />
        <p className="max-w-32 text-sm text-mute">{scanLabel}</p>
      </div>
    </div>
  );
}
