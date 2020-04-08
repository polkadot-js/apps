// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PayoutValidator } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { AddressMini, Badge, Expander } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';
import PayButton from './PayButton';
import { createErasString } from './util';

interface Props {
  className?: string;
  isInElection?: boolean;
  payout: PayoutValidator;
}

interface State {
  eraStr: string;
  eras: BN[];
  nominators: Record<string, BN>;
  numNominators: number;
}

function Payout ({ className, isInElection, payout }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ eraStr, eras, nominators, numNominators }, setState] = useState<State>({
    eraStr: '',
    eras: [],
    nominators: {},
    numNominators: 0
  });

  useEffect((): void => {
    const eras = payout.eras.map(({ era }) => era);
    const eraStr = createErasString(eras);
    const nominators = payout.eras.reduce((nominators: Record<string, BN>, { stashes }): Record<string, BN> => {
      Object.entries(stashes).forEach(([stashId, value]): void => {
        if (nominators[stashId]) {
          nominators[stashId] = nominators[stashId].add(value);
        } else {
          nominators[stashId] = value;
        }
      });

      return nominators;
    }, {});

    setState({ eraStr, eras, nominators, numNominators: Object.keys(nominators).length });
  }, [payout]);

  return (
    <tr className={className}>
      <td className='address'><AddressMini value={payout.validatorId} /></td>
      <td className='start'>
        <Badge
          info={payout.eras.length}
          isInline
          type='counter'
        />
        <span className='payout-eras'>{eraStr}</span>
      </td>
      <td className='number'><FormatBalance value={payout.available} /></td>
      <td
        className='start'
        colSpan={2}
      >
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
          isInElection={isInElection}
          validatorId={payout.validatorId}
        />
      </td>
    </tr>
  );
}

export default React.memo(Payout);
