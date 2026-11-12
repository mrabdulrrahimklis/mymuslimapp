'use client';

/** Opens the browser's print dialog, where "Save as PDF" gives a PDF. */
export function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="rounded-full border border-line px-4 py-1.5 hover:border-noor">
      🖨 {label}
    </button>
  );
}
