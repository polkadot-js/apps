// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances, DerivedBalancesFees } from '@polkadot/ui-api/derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { ExtraFees } from './types';

import BN from 'bn.js';
import React from 'react';
import { Compact } from '@polkadot/types/codec';
import { withCall, withMulti } from '@polkadot/ui-api/index';
import { balanceFormat } from '@polkadot/ui-reactive/util/index';

import translate from '../translate';
import { ZERO_BALANCE } from './constants';

type Props = I18nProps & {
  amount: BN | Compact,
  fees: DerivedBalancesFees,
  derive_balances_votingBalance?: DerivedBalances,
  recipientId: string,
  onChange: (fees: ExtraFees) => void
};

type State = ExtraFees & {
  isCreation: boolean,
  isNoEffect: boolean
};

class Transfer extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      extraFees: new BN(0),
      extraAmount: new BN(0),
      extraWarn: false,
      isCreation: false,
      isNoEffect: false
    };
  }

  static getDerivedStateFromProps ({ amount, recipientId, derive_balances_votingBalance = ZERO_BALANCE, fees, onChange }: Props): State {
    let extraFees = fees.transferFee;

    if (derive_balances_votingBalance.votingBalance.isZero()) {
      extraFees = extraFees.add(fees.creationFee);
    }

    const extraAmount = amount instanceof Compact ? amount.toBn() : new BN(amount);
    const isCreation = derive_balances_votingBalance.votingBalance.isZero() && fees.creationFee.gtn(0);
    const isNoEffect = extraAmount.add(derive_balances_votingBalance.votingBalance).lte(fees.existentialDeposit);
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

    return [
      isNoEffect
        ? <li key='noeffect'>{t('transfer.noeffect', {
          defaultValue: 'The final recipient amount is less than the existential amount, hence the total will be deducted from the sender, however the recipient account will not reflect the amount sent'
        })}</li>
        : undefined,
      isCreation
        ? <li key='create'>{t('transfer.create', {
          defaultValue: 'A fee of {{creationFee}} will be deducted from the sender since the destination account does not exist',
          replace: {
            creationFee: `${balanceFormat(fees.creationFee)}`
          }
        })}</li>
        : undefined
    ];
  }
}

export default withMulti(
  Transfer,
  translate,
  withCall('derive.balances.votingBalance', { paramProp: 'recipientId' })
);
