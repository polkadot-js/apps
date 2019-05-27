// Copyright 2017-2019 @polkadot/app-transfer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { DerivedFees, DerivedBalances } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { Index } from '@polkadot/types';
import { AddressRow, Button, InputAddress, InputBalance, TxButton, TxComponent } from '@polkadot/ui-app';
import { withApi, withCalls, withMulti } from '@polkadot/ui-api';
import keyring from '@polkadot/ui-keyring';
import Checks, { calcSignatureLength } from '@polkadot/ui-signer/Checks';
import { ZERO_FEES } from '@polkadot/ui-signer/Checks/constants';

import translate from './translate';

type Props = I18nProps & ApiProps & {
  balances_fees?: DerivedFees,
  balances_votingBalance?: DerivedBalances
};

type State = {
  accountId: string | null,
  amount: BN,
  extrinsic: SubmittableExtrinsic | null,
  hasAvailable: boolean,
  maxBalance?: BN,
  recipientId: string | null
};

const ZERO = new BN(0);

const Wrapper = styled.div`
  .transfer--Transfer-address {
    flex: 0 1;
    padding: 1.5rem 0;

    .ui--AddressSummary {
      text-align: center;
    }
  }

  .transfer--Transfer-data {
    flex: 1 1;
    min-width: 0;
    padding: 0 1rem;
  }

  .transfer--Transfer-info {
    display: flex;
    flex-direction: row;
  }
`;

class Transfer extends TxComponent<Props, State> {
  state: State = {
    accountId: null,
    amount: ZERO,
    extrinsic: null,
    hasAvailable: true,
    maxBalance: ZERO,
    recipientId: null
  };

  componentDidUpdate (prevProps: Props, prevState: State) {
    const { balances_fees } = this.props;
    const { accountId, extrinsic, recipientId } = this.state;

    const hasLengthChanged = ((extrinsic && extrinsic.encodedLength) || 0) !== ((prevState.extrinsic && prevState.extrinsic.encodedLength) || 0);

    if ((accountId && prevState.accountId !== accountId) ||
      (recipientId && prevState.recipientId !== recipientId) ||
      (balances_fees !== prevProps.balances_fees) ||
      hasLengthChanged
    ) {
      this.setMaxBalance().catch(console.error);
    }
  }

  render () {
    const { t } = this.props;
    const { accountId, extrinsic, recipientId, hasAvailable, maxBalance } = this.state;

    return (
      <Wrapper>
        <div className='transfer--Transfer-info'>
          {this.renderAddress(accountId, 'medium')}
          <div className='transfer--Transfer-data'>
            <InputAddress
              help={t('Select the account you want to send funds from.')}
              label={t('from')}
              onChange={this.onChangeFrom}
              type='account'
            />
            <InputAddress
              help={t('Select a contact or paste the address you want to send funds to.')}
              label={t('to')}
              onChange={this.onChangeTo}
              type='all'
            />
            <InputBalance
              autoFocus
              help={t('Type the amount you want to transfer. Note that you can select the unit on the right e.g sending 1 mili is equivalent to sending 0.001.')}
              isError={!hasAvailable}
              label={t('amount')}
              maxValue={maxBalance}
              onChange={this.onChangeAmount}
              onEnter={this.sendTx}
              withMax
            />
            <Checks
              accountId={accountId}
              extrinsic={extrinsic}
              isSendable
              onChange={this.onChangeFees}
            />
            <Button.Group>
              <TxButton
                accountId={accountId}
                isDisabled={!hasAvailable}
                isPrimary
                label={t('Make Transfer')}
                extrinsic={extrinsic}
                ref={this.button}
              />
            </Button.Group>
          </div>
          {this.renderAddress(recipientId, 'large')}
        </div>
      </Wrapper>
    );
  }

  private renderAddress (accountId: string | null, media: 'large' | 'medium') {
    if (!accountId) {
      return null;
    }

    try {
      keyring.decodeAddress(accountId);
    } catch (err) {
      return null;
    }

    return (
      <div className={`transfer--Transfer-address ui--media-${media}`}>
        <AddressRow
          value={accountId}
          withAvailable
        />
      </div>
    );
  }

  private nextState (newState: Partial<State>): void {
    this.setState((prevState: State): State => {
      const { api } = this.props;
      const { accountId = prevState.accountId, amount = prevState.amount, recipientId = prevState.recipientId, hasAvailable = prevState.hasAvailable, maxBalance = prevState.maxBalance } = newState;
      const extrinsic = accountId && recipientId
        ? api.tx.balances.transfer(recipientId, amount)
        : null;

      return {
        accountId,
        amount,
        extrinsic,
        hasAvailable,
        maxBalance,
        recipientId
      };
    });
  }

  private setMaxBalance = async () => {
    const { api, balances_fees = ZERO_FEES } = this.props;
    const { accountId, recipientId } = this.state;

    if (!accountId || !recipientId) {
      return;
    }

    const { transferFee, transactionBaseFee, transactionByteFee, creationFee } = balances_fees;

    // FIXME The any casts here are irritating, but they are basically caused by the derive
    // not really returning an actual `class implements Codec`
    // (if casting to DerivedBalance it would be `as any as DerivedBalance`)
    const accountNonce = await api.query.system.accountNonce(accountId) as Index;
    const senderBalance = (await api.derive.balances.all(accountId) as any).availableBalance;
    const recipientBalance = (await api.derive.balances.all(recipientId) as any).availableBalance;

    let prevMax = new BN(0);
    let maxBalance = new BN(1);
    let extrinsic;

    while (!prevMax.eq(maxBalance)) {
      prevMax = maxBalance;
      extrinsic = api.tx.balances.transfer(recipientId, prevMax);

      const txLength = calcSignatureLength(extrinsic, accountNonce);
      const fees = transactionBaseFee
        .add(transactionByteFee.muln(txLength))
        .add(transferFee)
        .add(recipientBalance.isZero() ? creationFee : ZERO);

      maxBalance = senderBalance.sub(fees);
    }

    this.nextState({
      extrinsic,
      maxBalance
    });
  }

  private onChangeFrom = (accountId: string) => {
    this.nextState({ accountId });
  }

  private onChangeAmount = (amount: BN = new BN(0)) => {
    this.nextState({ amount });
  }

  private onChangeTo = (recipientId: string) => {
    this.nextState({ recipientId });
  }

  private onChangeFees = (hasAvailable: boolean) => {
    this.setState({ hasAvailable });
  }
}

export default withMulti(
  Transfer,
  translate,
  withApi,
  withCalls<Props>(
    'derive.balances.fees'
  )
);
