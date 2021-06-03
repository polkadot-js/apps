// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { PayoutValidator } from './types';

import React, { useMemo } from 'react';

import { AddressMini, AddressSmall, Expander } from '@polkadot/react-components';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';
import PayButton from './PayButton';
import useEraBlocks from './useEraBlocks';
import { createErasString } from './util';

interface Props {
  className?: string;
  isDisabled?: boolean;
  payout: PayoutValidator;
}

interface State {
  eraStr: React.ReactNode;
  nominators: Record<string, BN>;
  numNominators: number;
  oldestEra?: BN;
}

function extractState (payout: PayoutValidator): State {
  const eraStr = createErasString(payout.eras.map(({ era }) => era));
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

  return { eraStr, nominators, numNominators: Object.keys(nominators).length, oldestEra: payout.eras[0]?.era };
}

function Validator ({ className = '', isDisabled, payout }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const { eraStr, nominators, numNominators, oldestEra } = useMemo(
    () => extractState(payout),
    [payout]
  );

  const eraBlocks = useEraBlocks(oldestEra);

  return (
    <tr className={className}>
      <td
        className='address'
        colSpan={2}
      >
        <AddressSmall value={payout.validatorId} />
      </td>
      <td className='start'>
        <span className='payout-eras'>{eraStr}</span>
      </td>
      <td className='number'><FormatBalance value={payout.available} /></td>
      <td className='number'>{eraBlocks && <BlockToTime value={eraBlocks} />}</td>
      <td
        className='expand'
        colSpan={2}
      >
        <Expander summary={t<string>('{{count}} own stashes', { replace: { count: numNominators } })}>
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
          isDisabled={isDisabled}
          payout={payout}
        />
      </td>
    </tr>
  );
}

export default React.memo(Validator);
