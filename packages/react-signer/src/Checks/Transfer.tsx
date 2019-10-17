/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances, DerivedFees } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';
import { ExtraFees } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { Compact, UInt } from '@polkadot/types';
import { withCalls, withMulti } from '@polkadot/react-api';
import { Icon } from '@polkadot/react-components';
import { formatBalance } from '@polkadot/util';

import translate from '../translate';
import { ZERO_BALANCE } from './constants';

interface Props extends I18nProps {
  amount: BN | Compact<UInt>;
  fees: DerivedFees;
  balances_all?: DerivedBalances;
  recipientId: string;
  onChange: (fees: ExtraFees) => void;
}

interface State extends ExtraFees {
  isCreation: boolean;
  isNoEffect: boolean;
}

export function Transfer ({ amount, balances_all = ZERO_BALANCE, fees, onChange, t }: Props): React.ReactElement<Props> {
  const [{ isCreation, isNoEffect }, setState] = useState<State>({
    extraFees: new BN(0),
    extraAmount: new BN(0),
    extraWarn: false,
    isCreation: false,
    isNoEffect: false
  });

  useEffect((): void => {
    let extraFees = new BN(fees.transferFee);

    if (balances_all.votingBalance.isZero()) {
      extraFees = extraFees.add(fees.creationFee);
    }

    const extraAmount = amount instanceof Compact ? amount.unwrap() : new BN(amount);
    const isCreation = balances_all.votingBalance.isZero() && fees.creationFee.gtn(0);
    const isNoEffect = extraAmount.add(balances_all.votingBalance).lt(fees.existentialDeposit);
    const extraWarn = isCreation || isNoEffect;
    const update = {
      extraAmount,
      extraFees,
      extraWarn
    };

    onChange(update);

    setState({
      ...update,
      isCreation,
      isNoEffect
    });
  }, [amount, balances_all, fees]);

  return (
    <>
      {isNoEffect && (
        <div>
          <Icon name='warning sign' />
          {t('The final recipient balance is less or equal to {{existentialDeposit}} (the existential amount) and will not be reflected', {
            replace: {
              existentialDeposit: formatBalance(fees.existentialDeposit)
            }
          })}
        </div>
      )}
      {isCreation && (
        <div>
          <Icon name='warning sign' />
          {t('A fee of {{creationFee}} will be deducted from the sender since the destination account does not exist', {
            replace: {
              creationFee: formatBalance(fees.creationFee)
            }
          })}
        </div>
      )}
    </>
  );
}

export default withMulti(
  Transfer,
  translate,
  withCalls<Props>(
    ['derive.balances.all', { paramName: 'recipientId' }]
  )
);
