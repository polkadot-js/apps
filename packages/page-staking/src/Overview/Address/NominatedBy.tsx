// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { EraIndex, SlashingSpans } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import { AddressMini, Expander, Spinner } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  nominators?: [string, EraIndex, number][];
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

function extractChilled (nominators: [string, EraIndex, number][] = [], slashingSpans?: SlashingSpans | null): Chilled {
  const chilled = slashingSpans
    ? nominators
      .filter(([, submittedIn]) => !slashingSpans.lastNonzeroSlash.isZero() && slashingSpans.lastNonzeroSlash.gte(submittedIn))
      .map(([who]) => who)
    : [];

  return {
    active: extractFunction(
      nominators
        .filter(([who]) => !chilled.includes(who))
        .map(([who]) => who)
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
      {nominators
        ? (
          <>
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
          </>
        )
        : <Spinner variant='mini' />
      }
    </td>
  );
}

export default React.memo(NominatedBy);
