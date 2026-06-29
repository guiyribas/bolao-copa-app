import type { MockPersona } from '@/mocks/types';

import { defaultPersona } from './default';

const personas: Record<string, MockPersona> = {
  default: defaultPersona,
};

export function getActivePersona(): MockPersona {
  const id = process.env.NEXT_PUBLIC_MOCK_PERSONA ?? 'default';
  const persona = personas[id];

  if (!persona) {
    throw new Error(
      `Unknown mock persona "${id}". Available: ${Object.keys(personas).join(', ')}`,
    );
  }

  return persona;
}

export { defaultPersona };
