import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  KNOCKOUT_SLOT_UNDEFINED_LABEL,
  resolveKnockoutSlotLabel,
} from './knockout-slot-label';

describe('resolveKnockoutSlotLabel', () => {
  it('divide títulos do seed com vs', () => {
    const match = {
      title: 'Runner-up Group A vs Runner-up Group B',
    };

    assert.equal(resolveKnockoutSlotLabel(match, 'home'), 'Runner-up Group A');
    assert.equal(resolveKnockoutSlotLabel(match, 'away'), 'Runner-up Group B');
  });

  it('divide títulos com x', () => {
    const match = {
      title: 'Brasil x Argentina',
    };

    assert.equal(resolveKnockoutSlotLabel(match, 'home'), 'Brasil');
    assert.equal(resolveKnockoutSlotLabel(match, 'away'), 'Argentina');
  });

  it('usa fallback quando o título está ausente', () => {
    assert.equal(resolveKnockoutSlotLabel(null, 'home'), KNOCKOUT_SLOT_UNDEFINED_LABEL);
    assert.equal(resolveKnockoutSlotLabel({ title: '   ' }, 'away'), KNOCKOUT_SLOT_UNDEFINED_LABEL);
  });

  it('usa fallback quando o título não tem separador reconhecível', () => {
    const match = {
      title: 'Partida 73',
    };

    assert.equal(resolveKnockoutSlotLabel(match, 'home'), KNOCKOUT_SLOT_UNDEFINED_LABEL);
    assert.equal(resolveKnockoutSlotLabel(match, 'away'), KNOCKOUT_SLOT_UNDEFINED_LABEL);
  });
});
