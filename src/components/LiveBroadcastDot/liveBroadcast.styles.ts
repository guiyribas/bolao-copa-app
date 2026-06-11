import { twMerge } from 'tailwind-merge';

/** Partida ao vivo: ring vermelho suave (como antes) + halo pulsante. */
export const liveFrame = twMerge(
  'relative ring-2 ring-red-500/35 shadow-sm shadow-neutral-900/10'
);

/** Halo que some e reaparece — mesma curva do animate-ping da bolinha, escala mínima. */
export const liveFramePing = twMerge(
  'pointer-events-none absolute inset-0 rounded-[inherit]',
  'ring-2 ring-red-500/35 opacity-75 animate-live-frame-ping'
);
