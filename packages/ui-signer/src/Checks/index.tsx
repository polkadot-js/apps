// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { DerivedFees, DerivedBalances, DerivedContractFees } from '@polkadot/api-derive/types';
import { IExtrinsic } from '@polkadot/types/types';
import { ExtraFees } from './types';

import BN from 'bn.js';
import React from 'react';
import { Compact, Method } from '@polkadot/types';
import { withCalls } from '@polkadot/ui-api';
import { Icon } from '@polkadot/ui-app';
import { compactToU8a, formatBalance } from '@polkadot/util';

import translate from '../translate';
import ContractCall from './ContractCall';
import ContractDeploy from './ContractDeploy';
import Proposal from './Proposal';
import Transfer from './Transfer';
import { MAX_SIZE_BYTES, MAX_SIZE_MB, ZERO_BALANCE, ZERO_FEES_BALANCES, ZERO_FEES_CONTRACT } from './constants';

type State = ExtraFees & {
  allFees: BN,
  allTotal: BN,
  allWarn: boolean,
  extMethod?: string,
  extSection?: string,
  hasAvailable: boolean,
  isRemovable: boolean,
  isReserved: boolean,
  overLimit: boolean
};

type Props = I18nProps & {
  balances_fees?: DerivedFees,
  balances_all?: DerivedBalances,
  contract_fees?: DerivedContractFees,
  accountId?: string | null,
  extrinsic?: IExtrinsic | null,
  isSendable: boolean,
  onChange?: (hasAvailable: boolean) => void,
  system_accountNonce?: BN
};

const LENGTH_PUBLICKEY = 32 + 1; // publicKey + prefix
const LENGTH_SIGNATURE = 64;
const LENGTH_ERA = 1;
export const SIGNATURE_SIZE = LENGTH_PUBLICKEY + LENGTH_SIGNATURE + LENGTH_ERA;

export const calcSignatureLength = (extrinsic?: IExtrinsic | null, accountNonce?: BN): number => {
  return SIGNATURE_SIZE +
    (accountNonce ? compactToU8a(accountNonce).length : 0) +
    (extrinsic ? extrinsic.encodedLength : 0);
};

export class FeeDisplay extends React.PureComponent<Props, State> {
  state: State = {
    allFees: new BN(0),
    allTotal: new BN(0),
    allWarn: false,
    extraAmount: new BN(0),
    extraFees: new BN(0),
    extraWarn: false,
    hasAvailable: false,
    isRemovable: false,
    isReserved: false,
    overLimit: false
  };

  static getDerivedStateFromProps ({ accountId, balances_all = ZERO_BALANCE, extrinsic, balances_fees = ZERO_FEES_BALANCES, system_accountNonce = new BN(0) }: Props, prevState: State): State | null {
    if (!accountId || !extrinsic) {
      return null;
    }

    const fn = Method.findFunction(extrinsic.callIndex);
    const extMethod = fn.method;
    const extSection = fn.section;
    const txLength = calcSignatureLength(extrinsic, system_accountNonce);

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
    const hasAvailable = balances_all.availableBalance.gtn(0);
    const isRemovable = balances_all.votingBalance.sub(allTotal).lte(balances_fees.existentialDeposit);
    const isReserved = balances_all.freeBalance.isZero() && balances_all.reservedBalance.gtn(0);
    const allWarn = extraWarn;
    const overLimit = txLength >= MAX_SIZE_BYTES;

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
      isReserved,
      overLimit
    };
  }

  componentDidUpdate () {
    const { onChange } = this.props;
    const { hasAvailable } = this.state;

    onChange && onChange(hasAvailable);
  }

  render () {
    const { accountId, balances_fees, className, isSendable, t } = this.props;
    const { allFees, allTotal, allWarn, hasAvailable, isRemovable, isReserved, overLimit } = this.state;

    if (!accountId) {
      return null;
    }

    const feeClass = !hasAvailable || overLimit || isRemovable
      ? 'error'
      : (
        allWarn
          ? 'warning'
          : 'normal'
      );

    // display all the errors, warning and information messages (in that order)
    return (
      <article
        className={[className, feeClass, 'padded'].join(' ')}
        key='txinfo'
      >
        {
          isSendable
            ? undefined
            : <div><Icon name='ban' />{t('The selected account does not exist on your keyring')}</div>
        }
        {
          hasAvailable
            ? undefined
            : <div><Icon name='ban' />{t('The selected account does not have the required balance available for this transaction')}</div>
        }
        {
          overLimit
            ? <div><Icon name='ban' />{t(`This transaction will be rejected by the node as it is greater than the maximum size of ${MAX_SIZE_MB}MB`)}></div>
            : undefined
        }
        {
          isRemovable && hasAvailable
            ? <div>
                <Icon name='ban' />
                {t('Submitting this transaction will drop the account balance to below the existential amount ({{existentialDeposit}}), which can result in the account being removed from the chain state and its associated funds burned.',
                  {
                    replace: {
                      existentialDeposit: formatBalance(balances_fees && balances_fees.existentialDeposit)
                    }
                  }
                )}
              </div>
            : undefined
        }
        {this.renderTransfer()}
        {this.renderProposal()}
        {this.renderCall()}
        {this.renderDeploy()}
        {
          isReserved
            ? <div><Icon name='arrow right' />{t('This account does have a reserved/locked balance, not taken into account')}</div>
            : undefined
        }
        <div><Icon name='arrow right' />{t('Fees includes the transaction fee and the per-byte fee')}</div>
        <div><Icon name='arrow right' />{t('Fees totalling {{fees}} will be applied to the submission', {
          replace: {
            fees: formatBalance(allFees)
          }
        })}</div>
        <div><Icon name='arrow right' />{t('{{total}} total transaction amount (fees + value)', {
          replace: {
            total: formatBalance(allTotal)
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

  private renderCall () {
    const { extrinsic, contract_fees = ZERO_FEES_CONTRACT } = this.props;
    const { extMethod, extSection } = this.state;

    if (!contract_fees || !extrinsic || extSection !== 'contract' || extMethod !== 'call') {
      return null;
    }

    const [, endowment] = extrinsic.args;

    return (
      <ContractCall
        endowment={endowment as any as Compact}
        fees={contract_fees}
        onChange={this.onExtraUpdate}
      />
    );
  }

  private renderDeploy () {
    const { extrinsic, contract_fees = ZERO_FEES_CONTRACT } = this.props;
    const { extMethod, extSection } = this.state;

    if (!contract_fees || !extrinsic || extSection !== 'contract' || extMethod !== 'create') {
      return null;
    }

    const [endowment] = extrinsic.args;

    return (
      <ContractDeploy
        endowment={endowment as any as Compact}
        fees={contract_fees}
        onChange={this.onExtraUpdate}
      />
    );
  }

  private onExtraUpdate = (extra: ExtraFees) => {
    this.setState({ ...extra });
  }
}

export default translate(
  withCalls<Props>(
    'derive.balances.fees',
    ['derive.balances.all', { paramName: 'accountId' }],
    'derive.contracts.fees',
    ['query.system.accountNonce', { paramName: 'accountId' }]
  )(FeeDisplay)
);
