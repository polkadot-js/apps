// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PayoutValidator } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { AddressMini, AddressSmall, Expander } from '@polkadot/react-components';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';
import PayButton from './PayButton';
import { createErasString } from './util';
import useEraBlocks from './useEraBlocks';

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

function Validator ({ className = '', isDisabled, payout }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ eraStr, nominators, numNominators, oldestEra }, setState] = useState<State>({
    eraStr: '',
    nominators: {},
    numNominators: 0
  });
  const eraBlocks = useEraBlocks(oldestEra);

  useEffect((): void => {
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

    setState({ eraStr, nominators, numNominators: Object.keys(nominators).length, oldestEra: payout.eras[0]?.era });
  }, [payout]);

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
      <td className='number'>{eraBlocks && <BlockToTime blocks={eraBlocks} />}</td>
      <td
        className='start'
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
