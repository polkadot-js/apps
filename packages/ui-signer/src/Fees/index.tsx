// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { DerivedBalancesFees, DerivedBalances } from '@polkadot/ui-api/derive/types';
import { ExtraFees } from './types';

import BN from 'bn.js';
import React from 'react';
import { Extrinsic, Method } from '@polkadot/types';
import { withCall, withMulti } from '@polkadot/ui-api/index';
import { balanceFormat } from '@polkadot/ui-reactive/util/index';

import translate from '../translate';
import Proposal from './Proposal';
import Transfer from './Transfer';
import { ZERO_BALANCE, ZERO_FEES } from './constants';

type State = ExtraFees & {
  extMethod?: string,
  extSection?: string,
  hasAvailable: boolean,
  isRemovable: boolean,
  isReserved: boolean
};

type Props = I18nProps & {
  accountBalance?: DerivedBalances,
  accountId?: string | null,
  accountNonce?: BN,
  extrinsic: Extrinsic | null,
  fees?: DerivedBalancesFees,
  onChange?: (hasAvailble: boolean) => void
};

const LENGTH_PUBLICKEY = 32 + 1; // publicKey + prefix
const LENGTH_SIGNATURE = 64;
const LENGTH_NONCE = 8;
const LENGTH_ERA = 1;
const SIGNATURE_SIZE = LENGTH_PUBLICKEY + LENGTH_SIGNATURE + LENGTH_NONCE + LENGTH_ERA;

class FeeDisplay extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      extraAmount: new BN(0),
      extraFees: new BN(0),
      extraWarn: false,
      hasAvailable: false,
      isRemovable: false,
      isReserved: false,
      txfees: new BN(0),
      txtotal: new BN(0),
      txwarn: false
    };
  }

  static getDerivedStateFromProps ({ accountId, accountBalance = ZERO_BALANCE, extrinsic, fees = ZERO_FEES }: Props, prevState: State): State | null {
    if (!accountId || !extrinsic) {
      return null;
    }

    const fn = Method.findFunction(extrinsic.callIndex);
    const extMethod = fn.method;
    const extSection = fn.section;
    const txLength = SIGNATURE_SIZE + (
      extrinsic
        ? extrinsic.encodedLength
        : 0
    );
    const isSameExtrinsic = prevState.extMethod === extMethod && prevState.extSection === extSection;
    const extraAmount = isSameExtrinsic
      ? prevState.extraAmount
      : new BN(0);
    const extraFees = isSameExtrinsic
      ? prevState.extraFees
      : new BN(0);
    const extraWarn = isSameExtrinsic
      ? prevState.extraWarn
      : false;

    let txfees = extraFees
      .add(fees.transactionBaseFee)
      .add(fees.transactionByteFee.muln(txLength));

    const txtotal = amount.add(txfees);
    const hasAvailable = accountBalance.freeBalance.gte(txtotal);
    const isRemovable = accountBalance.votingBalance.sub(txtotal).lte(fees.existentialDeposit);
    const isReserved = accountBalance.freeBalance.isZero() && accountBalance.reservedBalance.gtn(0);
    const txwarn = extraWarn;

    return {
      extMethod,
      extSection,
      extraAmount,
      extraFees,
      extraWarn,
      hasAvailable,
      isRemovable,
      isReserved,
      txfees,
      txtotal,
      txwarn
    };
  }

  componentDidUpdate () {
    const { onChange } = this.props;
    const { hasAvailable } = this.state;

    onChange && onChange(hasAvailable);
  }

  render () {
    const { accountId, className, fees = ZERO_FEES, t } = this.props;
    const { hasAvailable, isRemovable, isReserved, txfees, txtotal, txwarn } = this.state;

    if (!accountId) {
      return null;
    }

    const feeClass = hasAvailable
      ? (
        txwarn
          ? 'warning'
          : 'normal'
        )
      : 'error';

    return (
      <article
        className={[className, feeClass, 'padded'].join(' ')}
        key='txinfo'
      >
        <ul>
          <li>{t('fees', {
            defaultValue: '{{fees}} fees will be applied to the submission.',
            replace: {
              fees: balanceFormat(txfees)
            }
          })}</li>
          <li>{t('fees.explain', {
            defaultValue: 'Fees includes the transaction fee and the per-byte fee.'
          })}</li>
          {this.renderTransfer()}
          {this.renderProposal()}
          {
            isRemovable && hasAvailable
              ? <li>{t('fees.remove', {
                defaultValue: 'Submitting this transaction will drop the account balance to below the existential amount, removing the account from the chain state and burning associated funds.'
              })}</li>
              : undefined
          }{
            hasAvailable
              ? undefined
              : <li>{t('fees.available', {
                defaultValue: 'The account does not have the required funds available for this transaction with the current values.'
              })}</li>
          }{
            isReserved
              ? <li>{t('fees.reserved', {
                defaultValue: 'This account does have a reserved/locked balance, not taken into account.'
              })}</li>
              : undefined
          }
          <li>{t('total', {
            defaultValue: '{{total}} total transaction amount (fees + value)',
            replace: {
              total: balanceFormat(txtotal)
            }
          })}</li>
        </ul>
      </article>
    );
  }

  private renderProposal () {
    const { extrinsic, fees } = this.props;
    const { extMethod, extSection } = this.state;

    if (!fees || !extrinsic || extSection !== 'democracy' || extMethod !== 'propose') {
      return null;
    }

    const [recipientId, amount] = extrinsic.args;

    return (
      <Proposal
        amount={amount}
        fees={fees}
        recipient={recipientId}
      />
    );
  }

  private renderTransfer () {
    const { extrinsic, fees } = this.props;
    const { extMethod, extSection } = this.state;

    if (!fees || !extrinsic || extSection !== 'balances' || extMethod !== 'transfer') {
      return null;
    }

    const [recipientId, amount] = extrinsic.args;

    return (
      <Transfer
        amount={amount}
        fees={fees}
        recipientId={recipientId}
        onChange={this.onExtraUpdate}
      />
    );
  }

  private onExtraUpdate = (extra: ExtraFees) => {
    this.setState({ ...extra });
  }
}

export default withMulti(
  FeeDisplay,
  translate,
  withCall('derive.balances.fees', { propName: 'fees' }),
  withCall('derive.balances.votingBalance', { paramProp: 'accountId', propName: 'accountBalance' }),
  withCall('query.system.accountNonce', { paramProp: 'accountId', propName: 'accountNonce' })
);
