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
import { compactToU8a } from '@polkadot/util';

import translate from '../translate';
import Proposal from './Proposal';
import Transfer from './Transfer';
import { ZERO_BALANCE, ZERO_FEES } from './constants';

type State = ExtraFees & {
  allFees: BN,
  allTotal: BN,
  allWarn: boolean,
  extMethod?: string,
  extSection?: string,
  hasAvailable: boolean,
  isRemovable: boolean,
  isReserved: boolean
};

type Props = I18nProps & {
  derive_balances_fees?: DerivedBalancesFees,
  derive_balances_votingBalance?: DerivedBalances,
  accountId?: string | null,
  extrinsic: Extrinsic | null,
  onChange?: (hasAvailble: boolean) => void,
  query_system_accountNonce?: BN
};

const LENGTH_PUBLICKEY = 32 + 1; // publicKey + prefix
const LENGTH_SIGNATURE = 64;
const LENGTH_ERA = 1;
const SIGNATURE_SIZE = LENGTH_PUBLICKEY + LENGTH_SIGNATURE + LENGTH_ERA;

class FeeDisplay extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      allFees: new BN(0),
      allTotal: new BN(0),
      allWarn: false,
      extraAmount: new BN(0),
      extraFees: new BN(0),
      extraWarn: false,
      hasAvailable: false,
      isRemovable: false,
      isReserved: false
    };
  }

  static getDerivedStateFromProps ({ accountId, derive_balances_votingBalance = ZERO_BALANCE, extrinsic, derive_balances_fees = ZERO_FEES, query_system_accountNonce = new BN(0) }: Props, prevState: State): State | null {
    if (!accountId || !extrinsic) {
      return null;
    }

    const fn = Method.findFunction(extrinsic.callIndex);
    const extMethod = fn.method;
    const extSection = fn.section;
    const txLength = SIGNATURE_SIZE + compactToU8a(query_system_accountNonce).length + (
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
    const allFees = extraFees
      .add(derive_balances_fees.transactionBaseFee)
      .add(derive_balances_fees.transactionByteFee.muln(txLength));

    const allTotal = extraAmount.add(allFees);
    const hasAvailable = derive_balances_votingBalance.freeBalance.gte(allTotal);
    const isRemovable = derive_balances_votingBalance.votingBalance.sub(allTotal).lte(derive_balances_fees.existentialDeposit);
    const isReserved = derive_balances_votingBalance.freeBalance.isZero() && derive_balances_votingBalance.reservedBalance.gtn(0);
    const allWarn = extraWarn;

    return {
      allFees,
      allTotal,
      allWarn,
      extMethod,
      extSection,
      extraAmount,
      extraFees,
      extraWarn,
      hasAvailable,
      isRemovable,
      isReserved
    };
  }

  componentDidUpdate () {
    const { onChange } = this.props;
    const { hasAvailable } = this.state;

    onChange && onChange(hasAvailable);
  }

  render () {
    const { accountId, className, t } = this.props;
    const { allFees, allTotal, allWarn, hasAvailable, isRemovable, isReserved } = this.state;

    if (!accountId) {
      return null;
    }

    const feeClass = hasAvailable
      ? (
        allWarn
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
            defaultValue: 'Fees totalling {{fees}} will be applied to the submission',
            replace: {
              fees: balanceFormat(allFees)
            }
          })}</li>
          <li>{t('fees.explain', {
            defaultValue: 'Fees includes the transaction fee and the per-byte fee'
          })}</li>
          {this.renderTransfer()}
          {this.renderProposal()}
          {
            isRemovable && hasAvailable
              ? <li>{t('fees.remove', {
                defaultValue: 'Submitting this transaction will drop the account balance to below the existential amount, removing the account from the chain state and burning associated funds'
              })}</li>
              : undefined
          }{
            hasAvailable
              ? undefined
              : <li>{t('fees.available', {
                defaultValue: 'The account does not have the required funds available for this transaction with the current values'
              })}</li>
          }{
            isReserved
              ? <li>{t('fees.reserved', {
                defaultValue: 'This account does have a reserved/locked balance, not taken into account'
              })}</li>
              : undefined
          }
          <li>{t('total', {
            defaultValue: '{{total}} total transaction amount (fees + value)',
            replace: {
              total: balanceFormat(allTotal)
            }
          })}</li>
        </ul>
      </article>
    );
  }

  private renderProposal () {
    const { extrinsic, derive_balances_fees } = this.props;
    const { extMethod, extSection } = this.state;

    if (!derive_balances_fees || !extrinsic || extSection !== 'democracy' || extMethod !== 'propose') {
      return null;
    }

    const [, deposit] = extrinsic.args;

    return (
      <Proposal
        deposit={deposit}
        fees={derive_balances_fees}
        onChange={this.onExtraUpdate}
      />
    );
  }

  private renderTransfer () {
    const { extrinsic, derive_balances_fees } = this.props;
    const { extMethod, extSection } = this.state;

    if (!derive_balances_fees || !extrinsic || extSection !== 'balances' || extMethod !== 'transfer') {
      return null;
    }

    const [recipientId, amount] = extrinsic.args;

    return (
      <Transfer
        amount={amount}
        fees={derive_balances_fees}
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
  withCall('derive.balances.fees'),
  withCall('derive.balances.votingBalance', { paramProp: 'accountId' }),
  withCall('query.system.accountNonce', { paramProp: 'accountId' })
);
