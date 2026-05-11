import { SITE_FIFA_DISCLAIMER } from '@/lib/site-brand';

const boxClass =
  'rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600 leading-relaxed';

type SiteFifaDisclaimerProps = {
  className?: string;
};

export function SiteFifaDisclaimer({ className }: SiteFifaDisclaimerProps) {
  return (
    <aside
      aria-label="Aviso legal"
      role="note"
      className={className ? `${boxClass} ${className}` : boxClass}
    >
      <p className="m-0">{SITE_FIFA_DISCLAIMER}</p>
    </aside>
  );
}
