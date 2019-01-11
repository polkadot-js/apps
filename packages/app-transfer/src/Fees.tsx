// Copyright 2017-2019 @polkadot/app-transfer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { DerivedBalancesFees, DerivedBalances } from '@polkadot/ui-api/derive/types';
import { Fees } from './types';

import BN from 'bn.js';
import React from 'react';
import { Balance, Extrinsic } from '@polkadot/types';
import { Static } from '@polkadot/ui-app/index';
import { withCall, withMulti } from '@polkadot/ui-api/index';
import { balanceFormat } from '@polkadot/ui-reactive/util/index';

import translate from './translate';

type State = Fees;

type Props = I18nProps & {
  accountId?: string | null,
  amount: BN,
  balanceFrom?: DerivedBalances,
  balanceTo?: DerivedBalances,
  extrinsic: Extrinsic | null,
  fees?: DerivedBalancesFees,
  recipientId?: string | null,
  onChange: (fees: Fees) => void
};

const ZERO_BALANCE = {
  freeBalance: new Balance(0),
  reservedBalance: new Balance(0),
  votingBalance: new Balance(0)
} as DerivedBalances;

const ZERO_FEES = {
  transactionBaseFee: new BN(0),
  transactionByteFee: new BN(0),
  creationFee: new BN(0),
  existentialDeposit: new BN(0),
  transferFee: new BN(0)
} as DerivedBalancesFees;

const LENGTH_PUBLICKEY = 32 + 1; // publicKey + prefix
const LENGTH_SIGNATURE = 64;
const LENGTH_NONCE = 8;
const LENGTH_ERA = 1;

// FIXME Hardcoded signature size. This _should_ be ok for the poc-3 version, however in reality is needs to
// come from somewhere else (signer?). The issue is that we don't have the tx signed at this point, so we are
// manually adding the signature size. As it stands, this will be problematic with Compact encoding on accountNonce.
// Additionally, era assumes immortal transcations...
const SIGNATURE_SIZE = LENGTH_PUBLICKEY + LENGTH_SIGNATURE + LENGTH_NONCE + LENGTH_ERA;

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

  static getDerivedStateFromProps ({ accountId, amount, balanceTo = ZERO_BALANCE, balanceFrom = ZERO_BALANCE, extrinsic, fees = ZERO_FEES, recipientId }: Props): State | null {
    if (!accountId || !recipientId) {
      return null;
    }

    const txLength = SIGNATURE_SIZE + (
      extrinsic
        ? extrinsic.encodedLength
        : 0
    );

    let txfees = fees.transactionBaseFee
        .add(fees.transferFee)
        .add(fees.transactionByteFee.muln(txLength));

    if (balanceTo.votingBalance.isZero()) {
      txfees = txfees.add(fees.creationFee);
    }

    const txtotal = amount.add(txfees);
    const hasAvailable = balanceFrom.freeBalance.gte(txtotal);
    const isCreation = balanceTo.votingBalance.isZero();
    const isNoEffect = amount.add(balanceTo.votingBalance).lte(fees.existentialDeposit);
    const isRemovable = balanceFrom.votingBalance.sub(txtotal).lte(fees.existentialDeposit);
    const isReserved = balanceFrom.freeBalance.isZero() && balanceFrom.reservedBalance.gtn(0);

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
    const { accountId, className, fees = ZERO_FEES, recipientId, t } = this.props;
    const { hasAvailable, isCreation, isNoEffect, isRemovable, isReserved, txfees, txtotal } = this.state;

    if (!accountId || !recipientId) {
      return null;
    }

    const feeClass = hasAvailable
      ? (
        (isRemovable || isNoEffect)
          ? 'warning'
          : 'normal'
        )
      : 'error';

    return [
      <Static
        className={className}
        key='txfees'
        label={t('fees', {
          defaultValue: 'with fees totalling'
        })}
        value={`${balanceFormat(txfees)}`}
      />,
      <article
        className={feeClass}
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
          isCreation && fees.creationFee.gtn(0)
            ? t('fees.create', {
              defaultValue: 'A fee of {{creationFee}} will be deducted from the sender since the destination account does not exist.',
              replace: {
                creationFee: `${balanceFormat(fees.creationFee)}`
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
        value={`${balanceFormat(txtotal)}`}
      />
    ];
  }
}

export default withMulti(
  FeeDisplay,
  translate,
  withCall('derive.balances.votingBalance', { paramProp: 'accountId', propName: 'balanceFrom' }),
  withCall('derive.balances.votingBalance', { paramProp: 'recipientId', propName: 'balanceTo' })
);
