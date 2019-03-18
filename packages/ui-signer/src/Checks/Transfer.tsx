// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances, DerivedFees } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { ExtraFees } from './types';

import BN from 'bn.js';
import React from 'react';
import { Compact } from '@polkadot/types';
import { withCall, withMulti } from '@polkadot/ui-api';
import { Icon } from '@polkadot/ui-app';
import { formatBalance } from '@polkadot/ui-util';

import translate from '../translate';
import { ZERO_BALANCE } from './constants';

type Props = I18nProps & {
  amount: BN | Compact,
  fees: DerivedFees,
  balances_votingBalance?: DerivedBalances,
  recipientId: string,
  onChange: (fees: ExtraFees) => void
};

type State = ExtraFees & {
  isCreation: boolean,
  isNoEffect: boolean
};

class Transfer extends React.PureComponent<Props, State> {
  state: State = {
    extraFees: new BN(0),
    extraAmount: new BN(0),
    extraWarn: false,
    isCreation: false,
    isNoEffect: false
  };

  static getDerivedStateFromProps ({ amount, balances_votingBalance = ZERO_BALANCE, fees, onChange }: Props): State {
    let extraFees = new BN(fees.transferFee);

    if (balances_votingBalance.votingBalance.isZero()) {
      extraFees = extraFees.add(fees.creationFee);
    }

    const extraAmount = amount instanceof Compact ? amount.toBn() : new BN(amount);
    const isCreation = balances_votingBalance.votingBalance.isZero() && fees.creationFee.gtn(0);
    const isNoEffect = extraAmount.add(balances_votingBalance.votingBalance).lte(fees.existentialDeposit);
    const extraWarn = isCreation || isNoEffect;
    const update = {
      extraAmount,
      extraFees,
      extraWarn
    };

    onChange(update);

    return {
      ...update,
      isCreation,
      isNoEffect
    };
  }

  render () {
    const { fees, t } = this.props;
    const { isCreation, isNoEffect } = this.state;

    return (
      <>
        {
          isNoEffect
            ? <div><Icon name='warning sign' />{t('The final recipient balance is less than the existential amount and will not be reflected')}</div>
            : undefined
        }
        {
          isCreation
            ? <div><Icon name='warning sign' />{t('A fee of {{creationFee}} will be deducted from the sender since the destination account does not exist', {
              replace: {
                creationFee: formatBalance(fees.creationFee)
              }
            })}</div>
            : undefined
        }
      </>
    );
  }
}

export default withMulti(
  Transfer,
  translate,
  withCall('derive.balances.votingBalance', { paramName: 'recipientId' })
);
