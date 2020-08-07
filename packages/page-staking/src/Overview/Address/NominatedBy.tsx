// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EraIndex, SlashingSpans } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
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

function NominatedBy ({ nominators, slashingSpans }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ active, chilled }, setChilled] = useState<Chilled>({ active: [], chilled: [] });

  useEffect((): void => {
    if (nominators) {
      const chilled = slashingSpans
        ? nominators
          .filter(([, submittedIn]) => submittedIn.lte(slashingSpans.lastNonzeroSlash))
          .map(([who]) => who)
        : [];
      const active = nominators
        .filter(([who]) => !chilled.includes(who))
        .map(([who]) => who);

      setChilled({ active, chilled });
    }
  }, [nominators, slashingSpans]);

  return (
    <td className='start all'>
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
              <Expander summary={t<string>('Chilled ({{count}})', { replace: { count: formatNumber(chilled.length) } })}>
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
