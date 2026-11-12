import type { ReactNode } from 'react';

export type MenuItem = { value: string; label: ReactNode; lang?: string };

/**
 * A dropdown of choices posted to [action] as `name=value`; the [current]
 * one is highlighted and ticked. `back` brings the visitor to [path].
 */
export function Menu({
  label, summary, name, items, current, action, path, wide = false,
}: {
  label: string;
  summary: ReactNode;
  name: string;
  items: MenuItem[];
  current: string;
  action: (formData: FormData) => Promise<void>;
  path: string;
  wide?: boolean;
}) {
  return (
    <details className="group relative">
      <summary
        aria-label={label}
        title={label}
        className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm hover:border-noor"
      >
        {summary} <span className="text-mute group-open:rotate-180">▾</span>
      </summary>
      <form
        action={action}
        className={`absolute end-0 z-20 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-line bg-panel p-1 shadow-2xl ${wide ? 'w-80' : 'w-56'}`}
      >
        <p className="px-3 pb-1 pt-2 text-xs font-semibold text-mute">{label}</p>
        <input type="hidden" name="back" value={path} />
        {items.map((item) => {
          const active = item.value === current;
          return (
            <button
              key={item.value}
              name={name}
              value={item.value}
              lang={item.lang}
              aria-pressed={active}
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-start text-sm ${
                active ? 'bg-noor/15 font-semibold text-noor' : 'hover:bg-white/10'
              }`}
            >
              <span className="flex-1">{item.label}</span>
              {active && <span aria-hidden>✓</span>}
            </button>
          );
        })}
      </form>
    </details>
  );
}
