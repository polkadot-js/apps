// Copyright 2017-2018 @polkadot/app-transfer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { RxBalance, RxFees } from '@polkadot/ui-react-rx/ApiObservable/types';
import { Fees } from './types';

import BN from 'bn.js';
import React from 'react';
import { Balance } from '@polkadot/api-codec';
import Static from '@polkadot/ui-app/Static';
import withMulti from '@polkadot/ui-react-rx/with/multi';
import withObservable from '@polkadot/ui-react-rx/with/observable';

import translate from './translate';

type State = Fees;

type Props = I18nProps & {
  amount: BN,
  balanceFrom?: RxBalance,
  balanceTo?: RxBalance,
  fees: RxFees,
  from?: Uint8Array | null,
  to?: Uint8Array | null,
  onChange: (fees: Fees) => void
};

const ZERO_BALANCE = {
  freeBalance: new Balance(0),
  votingBalance: new Balance(0)
} as RxBalance;

// FIXME Ok, this is really not cool. Based on the actual transaction we should calculate the size. However currently bacause of the "fully distant" nature of the signer component, we cannot really properly calculate the final size. So count it... and then fix it. (This needs to be sorted)
const TRANSFER_SIZE = 156;

class FeeDisplay extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      hasAvailable: false,
      isCreation: false,
      isNoEffect: false,
      isRemovable: false,
      isReserved: false,
      txfees: new BN(0),
      txtotal: new BN(0)
    };
  }

  static getDerivedStateFromProps ({ amount, to, from, fees, balanceTo = ZERO_BALANCE, balanceFrom = ZERO_BALANCE }: Props): State | null {
    if (!from || !to) {
      return null;
    }

    let txfees = fees.baseFee
      .add(fees.transferFee)
      .add(fees.byteFee.mul(TRANSFER_SIZE));

    if (balanceTo.votingBalance.toBn().isZero()) {
      txfees = txfees.add(fees.creationFee.toBn());
    }

    const txtotal = amount.add(txfees);
    const hasAvailable = balanceFrom.freeBalance.gte(txtotal);
    const isCreation = balanceTo.votingBalance.toBn().isZero();
    const isNoEffect = amount.add(balanceTo.votingBalance.toBn()).lte(fees.existentialDeposit.toBn());
    const isRemovable = balanceFrom.votingBalance.sub(txtotal).lte(fees.existentialDeposit.toBn());
    const isReserved = balanceFrom.freeBalance.toBn().isZero() && balanceFrom.reservedBalance.gt(0);

    return {
      hasAvailable,
      isCreation,
      isNoEffect,
      isRemovable,
      isReserved,
      txfees,
      txtotal
    };
  }

  componentDidUpdate () {
    const { onChange } = this.props;

    onChange(this.state);
  }

  render () {
    const { className, fees, from, to, t } = this.props;
    const { hasAvailable, isCreation, isNoEffect, isRemovable, isReserved, txfees, txtotal } = this.state;

    if (!from || !to) {
      return null;
    }

    return [
      <Static
        className={className}
        key='txfees'
        label={t('fees', {
          defaultValue: 'with fees totalling'
        })}
        value={txfees.toString()}
      />,
      <article
        className={hasAvailable ? ((isRemovable || isNoEffect) ? 'warning' : '') : 'error'}
        key='txinfo'
      >
        {
          isRemovable && hasAvailable
              ? t('fees.remove', {
                defaultValue: 'Submitting this transaction will drop the account balance to below the existential amount, removing the account from the chain state and burning associated funds. '
              })
            : undefined
        }{
          isNoEffect && hasAvailable
            ? t('fees.noeffect', {
              defaultValue: 'The final recipient amount is less than the existential amount, hence the total will be deducted from the sender, however the recipient account will not reflect the amount sent. '
            })
            : undefined
        }{
          hasAvailable
            ? undefined
            : t('fees.available', {
              defaultValue: 'The account does not have the required funds available for this transaction with the current values. '
            })
        }{
          isReserved
          ? t('fees.reserved', {
            defaultValue: '(This account does have a reserved/locked balance, staking locks up the available funds) '
          })
          : undefined
        }{
          t('fees.explain', {
            defaultValue: 'Fees includes the transaction fee and the per-byte fee. '
          })
        }{
          isCreation && fees.creationFee.gt(0)
            ? t('fees.create', {
              defaultValue: 'A fee of {{creationFee}} will be deducted from the sender since the destination account does not exist.',
              replace: {
                creationFee: fees.creationFee.toString()
              }
            })
          : undefined
        }
      </article>,
      <Static
        className='medium'
        key='txtotal'
        label={t('total', {
          defaultValue: 'total transaction amount (fees + value)'
        })}
        value={txtotal.toString()}
    />
    ];
  }
}

export default withMulti(
  translate(FeeDisplay),
  withObservable('votingBalance', { paramProp: 'from', propName: 'balanceFrom' }),
  withObservable('votingBalance', { paramProp: 'to', propName: 'balanceTo' })
);
