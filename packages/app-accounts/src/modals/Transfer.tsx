/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { Index } from '@polkadot/types/interfaces';
import { ApiProps } from '@polkadot/react-api/types';
import { DerivedFees } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { Button, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { Available } from '@polkadot/react-query';
import Checks, { calcTxLength } from '@polkadot/react-signer/Checks';
import { withApi, withCalls, withMulti } from '@polkadot/react-api';
import { ZERO_FEES } from '@polkadot/react-signer/Checks/constants';
import { bnMax } from '@polkadot/util';

import translate from '../translate';

interface Props extends ApiProps, I18nProps {
  balances_fees?: DerivedFees;
  className?: string;
  onClose: () => void;
  recipientId?: string;
  senderId?: string;
  system_accountNonce?: BN;
}

interface State {
  amount: BN;
  extrinsic: SubmittableExtrinsic | null;
  hasAvailable: boolean;
  maxBalance?: BN;
  recipientId?: string | null;
  senderId?: string | null;
}

const ZERO = new BN(0);

class Transfer extends React.PureComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    this.state = {
      amount: ZERO,
      extrinsic: null,
      hasAvailable: true,
      maxBalance: ZERO,
      recipientId: props.recipientId || null,
      senderId: props.senderId || null
    };
  }

  public componentDidUpdate (prevProps: Props, prevState: State): void {
    const { balances_fees } = this.props;
    const { extrinsic, recipientId, senderId } = this.state;
    const hasLengthChanged = ((extrinsic && extrinsic.encodedLength) || 0) !== ((prevState.extrinsic && prevState.extrinsic.encodedLength) || 0);

    if ((recipientId && prevState.recipientId !== recipientId) ||
      (balances_fees !== prevProps.balances_fees) || (prevState.senderId !== senderId) ||
      hasLengthChanged
    ) {
      this.setMaxBalance().catch((error: Error): void => console.error(error));
    }
  }

  public render (): React.ReactNode {
    const { className, onClose, recipientId: propRecipientId, senderId: propSenderId, t } = this.props;
    const { extrinsic, hasAvailable, maxBalance, recipientId, senderId } = this.state;
    const available = <span className='label'>{t('available ')}</span>;

    return (
      <Modal
        className='app--accounts-Modal'
        dimmer='inverted'
        open
      >
        <Modal.Header>{t('Send funds')}</Modal.Header>
        <Modal.Content>
          <div className={className}>
            <InputAddress
              defaultValue={propSenderId}
              help={t('The account you will send funds from.')}
              isDisabled={!!propSenderId}
              label={t('send from account')}
              labelExtra={<Available label={available} params={senderId} />}
              onChange={this.onChangeFrom}
              type='account'
            />
            <InputAddress
              defaultValue={propRecipientId}
              help={t('Select a contact or paste the address you want to send funds to.')}
              isDisabled={!!propRecipientId}
              label={t('send to address')}
              labelExtra={<Available label={available} params={recipientId} />}
              onChange={this.onChangeTo}
              type='allPlus'
            />
            <InputBalance
              help={t('Type the amount you want to transfer. Note that you can select the unit on the right e.g sending 1 milli is equivalent to sending 0.001.')}
              isError={!hasAvailable}
              label={t('amount')}
              maxValue={maxBalance}
              onChange={this.onChangeAmount}
              withMax
            />
            <Checks
              accountId={senderId}
              extrinsic={extrinsic}
              isSendable
              onChange={this.onChangeFees}
            />
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button.Group>
            <Button
              icon='cancel'
              isNegative
              label={t('Cancel')}
              onClick={onClose}
            />
            <Button.Or />
            <TxButton
              accountId={senderId}
              extrinsic={extrinsic}
              icon='send'
              isDisabled={!hasAvailable}
              isPrimary
              label={t('Make Transfer')}
              onStart={onClose}
              withSpinner={false}
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }

  private nextState (newState: Partial<State>): void {
    this.setState((prevState: State): State => {
      const { api } = this.props;
      const { amount = prevState.amount, recipientId = prevState.recipientId, hasAvailable = prevState.hasAvailable, maxBalance = prevState.maxBalance, senderId = prevState.senderId } = newState;
      const extrinsic = recipientId && senderId
        ? api.tx.balances.transfer(recipientId, amount)
        : null;

      return {
        amount,
        extrinsic,
        hasAvailable,
        maxBalance,
        recipientId,
        senderId
      };
    });
  }

  private onChangeAmount = (amount: BN = new BN(0)): void => {
    this.nextState({ amount });
  }

  private onChangeFrom = (senderId: string | null): void => {
    this.nextState({ senderId });
  }

  private onChangeTo = (recipientId: string | null): void => {
    this.nextState({ recipientId });
  }

  private onChangeFees = (hasAvailable: boolean): void => {
    this.setState({ hasAvailable });
  }

  private setMaxBalance = async (): Promise<void> => {
    const { api, balances_fees = ZERO_FEES } = this.props;
    const { senderId, recipientId } = this.state;

    if (!senderId || !recipientId) {
      return;
    }

    const { transferFee, transactionBaseFee, transactionByteFee, creationFee } = balances_fees;
    const accountNonce = await api.query.system.accountNonce<Index>(senderId);
    const senderBalance = (await api.derive.balances.all(senderId)).availableBalance;
    const recipientBalance = (await api.derive.balances.all(recipientId)).availableBalance;

    let prevMax = new BN(0);
    let maxBalance = new BN(1);
    let extrinsic;

    while (!prevMax.eq(maxBalance)) {
      prevMax = maxBalance;
      extrinsic = api.tx.balances.transfer(recipientId, prevMax);

      const txLength = calcTxLength(extrinsic, accountNonce);
      const fees = transactionBaseFee
        .add(transactionByteFee.mul(txLength))
        .add(transferFee)
        .add(recipientBalance.isZero() ? creationFee : ZERO);

      maxBalance = bnMax(senderBalance.sub(fees), ZERO);
    }

    this.nextState({
      extrinsic,
      maxBalance
    });
  }
}

export default withMulti(
  styled(Transfer)`
    article.padded {
      box-shadow: none;
      margin-left: 2rem;
    }

    .balance {
      margin-bottom: 0.5rem;
      text-align: right;
      padding-right: 1rem;

      .label {
        opacity: 0.7;
      }
    }

    label.with-help {
      flex-basis: 10rem;
    }
  `,
  translate,
  withApi,
  withCalls<Props>(
    'derive.balances.fees'
  )
);
