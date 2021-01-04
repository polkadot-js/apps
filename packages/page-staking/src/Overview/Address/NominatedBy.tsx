// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SlashingSpans } from '@polkadot/types/interfaces';
import type { NominatedBy as NominatedByType } from '../../types';

import React, { useMemo } from 'react';

import { AddressMini, Expander } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  nominators?: NominatedByType[];
  slashingSpans?: SlashingSpans | null;
}

interface Chilled {
  active: null | [number, () => React.ReactNode[]];
  chilled: null | [number, () => React.ReactNode[]];
}

function extractFunction (all: string[]): null | [number, () => React.ReactNode[]] {
  return all.length
    ? [
      all.length,
      () => all.map((who): React.ReactNode =>
        <AddressMini
          key={who}
          value={who}
        />
      )
    ]
    : null;
}

function extractChilled (nominators: NominatedByType[] = [], slashingSpans?: SlashingSpans | null): Chilled {
  const chilled = slashingSpans
    ? nominators
      .filter(({ submittedIn }) => !slashingSpans.lastNonzeroSlash.isZero() && slashingSpans.lastNonzeroSlash.gte(submittedIn))
      .map(({ nominatorId }) => nominatorId)
    : [];

  return {
    active: extractFunction(
      nominators
        .filter(({ nominatorId }) => !chilled.includes(nominatorId))
        .map(({ nominatorId }) => nominatorId)
    ),
    chilled: extractFunction(chilled)
  };
}

function NominatedBy ({ nominators, slashingSpans }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const { active, chilled } = useMemo(
    () => extractChilled(nominators, slashingSpans),
    [nominators, slashingSpans]
  );

  return (
    <td className='expand all'>
      {active && (
        <Expander
          renderChildren={active[1]}
          summary={t<string>('Nominations ({{count}})', { replace: { count: formatNumber(active[0]) } })}
        />
      )}
      {chilled && (
        <Expander
          renderChildren={chilled[1]}
          summary={t<string>('Renomination required ({{count}})', { replace: { count: formatNumber(chilled[0]) } })}
        />
      )}
    </td>
  );
}

export default React.memo(NominatedBy);
