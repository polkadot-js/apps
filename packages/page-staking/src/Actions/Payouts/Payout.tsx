// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PayoutValidator } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { AddressMini, Expander } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../../translate';
import PayButton from './PayButton';

interface Props {
  className?: string;
  payout: PayoutValidator;
}

interface State {
  available: BN;
  eraStr: string;
  eras: BN[];
  nominators: Record<string, BN>;
  numNominators: number;
}

function Payout ({ className, payout }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ available, eraStr, eras, nominators, numNominators }, setState] = useState<State>({
    available: new BN(0),
    eraStr: '',
    eras: [],
    nominators: {},
    numNominators: 0
  });

  useEffect((): void => {
    const available = new BN(0);
    const eras = payout.eras.map(({ era }) => era);
    const eraStr = eras.length
      ? `(${formatNumber(eras.length)}) ${eras.map((era) => formatNumber(era)).join(', ')}`
      : '';
    const nominators = payout.eras.reduce((nominators: Record<string, BN>, { stashes }): Record<string, BN> => {
      Object.entries(stashes).forEach(([stashId, value]): void => {
        if (nominators[stashId]) {
          nominators[stashId] = nominators[stashId].add(value);
        } else {
          nominators[stashId] = value;
        }

        available.iadd(value);
      });

      return nominators;
    }, {});

    setState({ available, eraStr, eras, nominators, numNominators: Object.keys(nominators).length });
  }, [payout]);

  return (
    <tr className={className}>
      <td className='address'><AddressMini value={payout.validatorId} /></td>
      <td className='start'>{eraStr}</td>
      <td className='number'><FormatBalance value={available} /></td>
      <td className='start'>
        <Expander summary={t('{{count}} stakers', { replace: { count: numNominators } })}>
          {Object.entries(nominators).map(([stashId, balance]) =>
            <AddressMini
              balance={balance}
              key={stashId}
              value={stashId}
              withBalance
            />
          )}
        </Expander>
      </td>
      <td className='button'>
        <PayButton
          eras={eras}
          validatorId={payout.validatorId}
        />
      </td>
    </tr>
  );
}

export default React.memo(Payout);
