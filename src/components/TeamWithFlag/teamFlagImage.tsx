import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

export type TeamFlagImageSize = 'sm' | 'md' | 'lg' | 'bracket';

const FLAG_FRAME_CHROME = 'border border-neutral-200/80 shadow-sm';

const FRAME_STYLES: Record<TeamFlagImageSize, string> = {
  sm: 'h-[16px] w-[22px] shrink-0 overflow-hidden rounded-[2px]',
  md: 'inline-block h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] align-middle',
  lg: 'h-16 w-24 shrink-0 overflow-hidden rounded-md sm:h-20 sm:w-28',
  bracket: 'h-[13px] w-[18px] shrink-0 overflow-hidden rounded-[2px]',
};

const IMAGE_DIMS: Record<TeamFlagImageSize, { width: number; height: number }> = {
  sm: { width: 22, height: 16 },
  md: { width: 20, height: 14 },
  lg: { width: 112, height: 80 },
  bracket: { width: 18, height: 13 },
};

export type TeamFlagImageProps = {
  src: string;
  size?: TeamFlagImageSize;
  className?: string;
};

export function TeamFlagImage({
  src,
  size = 'sm',
  className,
}: TeamFlagImageProps) {
  const { width, height } = IMAGE_DIMS[size];

  return (
    <span
      data-flag-frame=""
      className={twMerge(FLAG_FRAME_CHROME, FRAME_STYLES[size], className)}
    >
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        className="h-full w-full scale-[1.1] object-cover object-center"
        unoptimized
      />
    </span>
  );
}
