import { twMerge } from 'tailwind-merge';

type Props = { className?: string };

/** Bolinha vermelha “ao vivo” com halo pulsante (animate-ping). */
export function LiveBroadcastDot({ className }: Props) {
  return (
    <span
      className={twMerge(
        'pointer-events-none absolute left-2 top-2 z-10 flex h-2.5 w-2.5',
        className
      )}
      aria-hidden
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600 shadow-sm ring-2 ring-white" />
    </span>
  );
}
