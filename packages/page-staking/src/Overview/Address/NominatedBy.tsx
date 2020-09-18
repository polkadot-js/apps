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
  active: string[];
  chilled: string[];
}

function extractChilled (nominators: [string, EraIndex, number][] = [], slashingSpans?: SlashingSpans | null): Chilled {
  const chilled = slashingSpans
    ? nominators
      .filter(([, submittedIn]) => !slashingSpans.lastNonzeroSlash.isZero() && slashingSpans.lastNonzeroSlash.gte(submittedIn))
      .map(([who]) => who)
    : [];
  const active = nominators
    .filter(([who]) => !chilled.includes(who))
    .map(([who]) => who);

  return { active, chilled };
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
            {active.length !== 0 && (
              <Expander summary={t<string>('Nominations ({{count}})', { replace: { count: formatNumber(active.length) } })}>
                {active.map((who): React.ReactNode =>
                  <AddressMini
                    key={who}
                    value={who}
                  />
                )}
              </Expander>
            )}
            {chilled.length !== 0 && (
              <Expander summary={t<string>('Renomination required ({{count}})', { replace: { count: formatNumber(chilled.length) } })}>
                {chilled.map((who): React.ReactNode =>
                  <AddressMini
                    key={who}
                    value={who}
                  />
                )}
              </Expander>
            )}
          </>
        )
        : <Spinner variant='mini' />
      }
    </td>
  );
}

export default React.memo(NominatedBy);
