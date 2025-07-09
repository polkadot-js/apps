// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { PayoutValidator } from './types.js';

import React, { useMemo } from 'react';

import { AddressMini, AddressSmall, Expander, Table } from '@polkadot/react-components';
import { BlockToTime } from '@polkadot/react-query';

import { useTranslation } from '../translate.js';
import PayButton from './PayButton.js';
import useEraBlocks from './useEraBlocks.js';
import { createErasString } from './util.js';

interface Props {
  className?: string;
  historyDepth?: BN;
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
  const eraStr = createErasString(payout.eras.filter(({ isClaimed }) => !isClaimed).map(({ era }) => era));
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

function Validator ({ className = '', historyDepth, isDisabled, payout }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const { eraStr, nominators, numNominators, oldestEra } = useMemo(
    () => extractState(payout),
    [payout]
  );

  const eraBlocks = useEraBlocks(historyDepth, oldestEra);

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
      <Table.Column.Balance value={payout.available} />
      <td className='number'>{eraBlocks && <BlockToTime value={eraBlocks} />}</td>
      <td
        className='expand'
        colSpan={2}
      >
        <Expander summary={t('{{count}} own stashes', { replace: { count: numNominators } })}>
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
