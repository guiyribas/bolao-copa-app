import { twMerge } from 'tailwind-merge';

export const header = twMerge(
  'sticky top-0 z-50 w-full border-b border-neutral-200 bg-background'
);

export const headerInner = twMerge(
  'mx-auto flex max-w-237.5 items-center justify-between px-4 py-3 md:py-4'
);

export const logo = twMerge('text-lg font-bold text-foreground');

export function navLink(active: boolean, className?: string) {
  return twMerge(
    'text-sm underline-offset-4 hover:underline',
    active ? 'font-bold underline' : '',
    className
  );
}

export const desktopNav = twMerge(
  'hidden md:flex md:items-center md:gap-4'
);

export const userName = twMerge(
  'max-w-[10rem] truncate text-sm text-neutral-600'
);

export const logoutButton = twMerge(
  'text-sm underline hover:text-neutral-900'
);

export const hamburgerButton = twMerge(
  'inline-flex md:hidden rounded p-1 text-foreground hover:bg-neutral-100',
  '[&_.material-symbols-outlined]:text-2xl [&_.material-symbols-outlined]:leading-none'
);

export const mobileOverlay = twMerge(
  'fixed inset-0 z-[100] flex flex-col bg-background pt-[env(safe-area-inset-top)]'
);

export const mobileOverlayBar = twMerge(
  'mx-auto flex w-full max-w-237.5 items-center justify-between border-b border-neutral-200 px-4 py-3'
);

export const mobileNav = twMerge(
  'mx-auto flex w-full max-w-237.5 flex-1 flex-col gap-8 px-4 py-10'
);

export const mobileNavLink = twMerge(
  'text-xl font-medium underline-offset-4 hover:underline'
);

export const mobileUserName = twMerge(
  'text-lg text-neutral-600'
);

export const mobileLogoutButton = twMerge(
  'mt-auto pb-[max(1.5rem,env(safe-area-inset-bottom))] text-left text-xl font-medium underline'
);
