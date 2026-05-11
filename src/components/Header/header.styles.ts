import { twMerge } from 'tailwind-merge';

const headerAccentText = 'text-yellow-200';
const headerAccentFill = 'bg-yellow-200';
const headerAccentDecoration = 'decoration-yellow-400/85';
const headerAccentRing = 'ring-yellow-400/90';
const headerAccentFocusRing =
  'focus-visible:ring-2 focus-visible:ring-yellow-400/90 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950';

export const header = twMerge(
  'sticky top-0 z-50 w-full border-b border-yellow-400/40',
  'bg-linear-to-r from-emerald-950 via-emerald-900 to-emerald-950',
  'shadow-[0_8px_24px_-12px_rgba(0,0,0,0.45)]',
  'print:hidden'
);

export const headerInner = twMerge(
  'mx-auto flex max-w-237.5 items-center justify-between gap-3 px-4 py-3 md:py-3.5'
);

export const logoLink = twMerge(
  'group inline-flex min-w-0 items-center gap-2.5 rounded-lg py-0.5 pr-1 outline-none',
  headerAccentFocusRing
);

export const logoLinkWithUser = twMerge(
  logoLink,
  'max-w-[min(58vw,18rem)] shrink sm:max-w-[min(62vw,20rem)] md:max-w-[22rem]'
);

export const logoTextColumn = twMerge('flex min-w-0 flex-col gap-0.5');

export const logoTitle = twMerge(
  'truncate text-[15px] font-bold tracking-tight text-white sm:text-base'
);

/** Abaixo do título; mantém o tom esmeralda claro de antes. */
export const logoUserName = twMerge(
  'min-w-0 max-w-full truncate whitespace-nowrap text-xs font-medium text-emerald-300/90 sm:text-[13px]'
);

/** Marca raster em /public — altura fixa, largura proporcional */
export const logoImage = twMerge(
  'h-8 w-auto max-h-10 max-w-[min(48vw,260px)] object-contain object-left sm:h-9 md:h-10'
);

export function navLink(active: boolean, className?: string) {
  return twMerge(
    'text-sm underline-offset-4 transition-colors',
    active
      ? twMerge('font-semibold underline', headerAccentText, headerAccentDecoration)
      : 'font-medium text-white/90 hover:text-white',
    className
  );
}

export function mobileNavLink(active: boolean, className?: string) {
  return twMerge(
    'text-xl underline-offset-4 transition-colors',
    active
      ? twMerge('font-semibold underline', headerAccentText, headerAccentDecoration)
      : 'font-medium text-white hover:text-white/95',
    className
  );
}

export const desktopNav = twMerge(
  'hidden md:flex md:items-center md:gap-4'
);

export const guestAuthActions = twMerge(
  'ml-1 flex shrink-0 items-center gap-3 pl-1 md:gap-4'
);

export const guestAuthIcon = twMerge(
  'material-symbols-outlined text-[1.125rem] leading-none'
);

const guestAuthFocusRing = twMerge(
  'rounded-full outline-none',
  headerAccentFocusRing
);

export function guestAuthLoginLink(active: boolean, className?: string) {
  return twMerge(
    guestAuthFocusRing,
    'inline-flex items-center gap-1.5 px-1 py-1 text-sm font-medium text-white no-underline transition-colors hover:text-white/95',
    active && 'font-semibold',
    className
  );
}

export function guestAuthRegisterButton(active: boolean, className?: string) {
  return twMerge(
    guestAuthFocusRing,
    'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-emerald-950 no-underline shadow-sm transition-colors hover:bg-yellow-100',
    headerAccentFill,
    active && twMerge('ring-1', headerAccentRing),
    className
  );
}

export const mobileGuestAuthActions = twMerge(
  'mt-4 flex flex-col gap-3 border-t border-yellow-400/25 pt-6'
);

export function mobileGuestAuthLoginLink(active: boolean, className?: string) {
  return guestAuthLoginLink(
    active,
    twMerge('w-full justify-center py-2 text-base', className)
  );
}

export function mobileGuestAuthRegisterButton(
  active: boolean,
  className?: string
) {
  return guestAuthRegisterButton(
    active,
    twMerge('w-full justify-center py-3 text-base', className)
  );
}

export const logoutButton = twMerge(
  'text-sm font-medium text-white no-underline',
  'hover:text-white/95 hover:bg-white/10 rounded-md px-1.5 py-0.5 -mx-1.5'
);

export const hamburgerButton = twMerge(
  'inline-flex md:hidden rounded-md p-1.5 text-white hover:bg-white/10',
  '[&_.material-symbols-outlined]:text-2xl [&_.material-symbols-outlined]:leading-none'
);

export const mobileOverlay = twMerge(
  'fixed inset-0 z-[100] flex flex-col bg-emerald-950 pt-[env(safe-area-inset-top)]'
);

export const mobileOverlayBar = twMerge(
  'mx-auto flex w-full max-w-237.5 items-center justify-between gap-2 border-b border-yellow-400/30 px-4 py-3'
);

export const mobileNav = twMerge(
  'mx-auto flex w-full max-w-237.5 flex-1 flex-col gap-8 px-4 py-10'
);

export const mobileLogoutButton = twMerge(
  'mt-auto pb-[max(1.5rem,env(safe-area-inset-bottom))] text-left text-xl font-medium text-white no-underline',
  'hover:text-white/95'
);
