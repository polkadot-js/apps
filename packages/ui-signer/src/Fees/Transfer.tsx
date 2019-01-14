// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances, DerivedBalancesFees } from '@polkadot/ui-api/derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { ExtraFees } from './types';

import BN from 'bn.js';
import React from 'react';
import { withCall, withMulti } from '@polkadot/ui-api/index';
import { balanceFormat } from '@polkadot/ui-reactive/util/index';

import translate from '../translate';
import { ZERO_BALANCE } from './constants';

type Props = I18nProps & {
  amount: BN,
  fees: DerivedBalancesFees,
  recipientBalance?: DerivedBalances,
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

  static getDerivedStateFromProps ({ amount, recipientBalance = ZERO_BALANCE, fees, onChange }: Props): State {
    let extraFees = fees.transferFee;

    if (recipientBalance.votingBalance.isZero()) {
      extraFees = extraFees.add(fees.creationFee);
    }

    const extraAmount = amount;
    const isCreation = recipientBalance.votingBalance.isZero();
    const isNoEffect = amount.add(recipientBalance.votingBalance).lte(fees.existentialDeposit);
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
        ? <li key='noeffect'>{t('fees.noeffect', {
          defaultValue: 'The final recipient amount is less than the existential amount, hence the total will be deducted from the sender, however the recipient account will not reflect the amount sent.'
        })}</li>
        : undefined,
      isCreation && fees.creationFee.gtn(0)
        ? <li key='create'>{t('fees.create', {
          defaultValue: 'A fee of {{creationFee}} will be deducted from the sender since the destination account does not exist.',
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
  withCall('derive.balances.votingBalance', { paramProp: 'recipientId', propName: 'recipientBalance' })
);
