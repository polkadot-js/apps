// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { DerivedFees, DerivedBalances } from '@polkadot/api-derive/types';
import { ExtraFees } from './types';

import BN from 'bn.js';
import React from 'react';
import { Extrinsic, Method } from '@polkadot/types';
import { withCall, withMulti } from '@polkadot/ui-api/index';
import { Icon } from '@polkadot/ui-app/index';
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
  balances_fees?: DerivedFees,
  balances_votingBalance?: DerivedBalances,
  accountId?: string | null,
  extrinsic: Extrinsic | null,
  onChange?: (hasAvailble: boolean) => void,
  system_accountNonce?: BN
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

  static getDerivedStateFromProps ({ accountId, balances_votingBalance = ZERO_BALANCE, extrinsic, balances_fees = ZERO_FEES, system_accountNonce = new BN(0) }: Props, prevState: State): State | null {
    if (!accountId || !extrinsic) {
      return null;
    }

    const fn = Method.findFunction(extrinsic.callIndex);
    const extMethod = fn.method;
    const extSection = fn.section;
    const txLength = SIGNATURE_SIZE + compactToU8a(system_accountNonce).length + (
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
      .add(balances_fees.transactionBaseFee)
      .add(balances_fees.transactionByteFee.muln(txLength));

    const allTotal = extraAmount.add(allFees);
    const hasAvailable = balances_votingBalance.freeBalance.gte(allTotal);
    const isRemovable = balances_votingBalance.votingBalance.sub(allTotal).lte(balances_fees.existentialDeposit);
    const isReserved = balances_votingBalance.freeBalance.isZero() && balances_votingBalance.reservedBalance.gtn(0);
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

    // display all the errors, warning and information messages (in that order)
    return (
      <article
        className={[className, feeClass, 'padded'].join(' ')}
        key='txinfo'
      >
        {
          hasAvailable
            ? undefined
            : <div><Icon name='ban' />{t('The account does not have the required funds available for this transaction with the current provided values')}</div>
        }
        {this.renderTransfer()}
        {this.renderProposal()}
        {
          isRemovable && hasAvailable
            ? <div><Icon name='warning sign' />{t('Submitting this transaction will drop the account balance to below the existential amount, removing the account from the chain state and burning associated funds')}</div>
            : undefined
        }{
          isReserved
            ? <div><Icon name='arrow right' />{t('This account does have a reserved/locked balance, not taken into account')}</div>
            : undefined
        }
        <div><Icon name='arrow right' />{t('Fees includes the transaction fee and the per-byte fee')}</div>
        <div><Icon name='arrow right' />{t('Fees totalling {{fees}} will be applied to the submission', {
          replace: {
            fees: balanceFormat(allFees)
          }
        })}</div>
        <div><Icon name='arrow right' />{t('{{total}} total transaction amount (fees + value)', {
          replace: {
            total: balanceFormat(allTotal)
          }
        })}</div>
      </article>
    );
  }

  private renderProposal () {
    const { extrinsic, balances_fees } = this.props;
    const { extMethod, extSection } = this.state;

    if (!balances_fees || !extrinsic || extSection !== 'democracy' || extMethod !== 'propose') {
      return null;
    }

    const [, deposit] = extrinsic.args;

    return (
      <Proposal
        deposit={deposit}
        fees={balances_fees}
        onChange={this.onExtraUpdate}
      />
    );
  }

  private renderTransfer () {
    const { extrinsic, balances_fees } = this.props;
    const { extMethod, extSection } = this.state;

    if (!balances_fees || !extrinsic || extSection !== 'balances' || extMethod !== 'transfer') {
      return null;
    }

    const [recipientId, amount] = extrinsic.args;

    return (
      <Transfer
        amount={amount}
        fees={balances_fees}
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
  withCall('derive.balances.votingBalance', { paramName: 'accountId' }),
  withCall('query.system.accountNonce', { paramName: 'accountId' })
);
