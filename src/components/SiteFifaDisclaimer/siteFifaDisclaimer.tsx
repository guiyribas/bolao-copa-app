import { SITE_FIFA_DISCLAIMER } from '@/lib/site-brand';

export function SiteFifaDisclaimer() {
  return (
    <aside aria-label="Aviso legal" role="note" className="italic">
      <p className="m-0">{SITE_FIFA_DISCLAIMER}</p>
    </aside>
  );
}
