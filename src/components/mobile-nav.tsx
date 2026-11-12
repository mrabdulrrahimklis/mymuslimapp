'use client';

import { useEffect, useState, type ReactNode } from 'react';

/**
 * The hamburger (top right on phones) and the side panel it opens with
 * [children]: the site's pages and settings. Closes on Escape, on the
 * backdrop, or when a link inside is followed.
 */
export function MobileNav({ label, closeLabel, children }: { label: string; closeLabel: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="grid h-10 w-10 place-items-center rounded-full border border-line hover:border-noor lg:hidden"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
      <div className={`fixed inset-0 z-40 lg:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/60 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label={label}
          inert={!open}
          onClick={(e) => (e.target as HTMLElement).closest('a') && setOpen(false)}
          className={`absolute inset-y-0 end-0 flex w-80 max-w-[85vw] flex-col gap-6 overflow-y-auto border-s border-line bg-ink p-5 shadow-2xl transition-transform ${
            open ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'
          }`}
        >
          <button
            type="button"
            aria-label={closeLabel}
            onClick={() => setOpen(false)}
            className="grid h-10 w-10 place-items-center self-end rounded-full border border-line hover:border-noor"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
          {children}
        </aside>
      </div>
    </>
  );
}
