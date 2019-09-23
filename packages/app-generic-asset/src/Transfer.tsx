// Copyright 2019 @polkadot/app-generic-asset authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { ApiProps } from '@polkadot/react-api/types';
import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { Button, InputAddress, InputBalance, TxButton, Dropdown } from '@polkadot/react-components';
import { Available } from '@polkadot/react-query';
import Checks from '@polkadot/react-signer/Checks';
import { withApi, withMulti, withObservable } from '@polkadot/react-api';

import assetRegistry, { AssetsSubjectInfo } from './assetsRegistry';
import translate from './translate';

type Props = ApiProps & I18nProps & {
  className?: string;
  onClose: () => void;
  recipientId?: string;
  senderId?: string;
  assets?: AssetsSubjectInfo;
};

interface State {
  assetId: string;
  amount: BN;
  extrinsic: SubmittableExtrinsic | null;
  hasAvailable: boolean;
  recipientId?: string | null;
  senderId?: string | null;
}

const ZERO = new BN(0);

class Transfer extends React.PureComponent<Props> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    this.state = {
      assetId: '0',
      amount: ZERO,
      extrinsic: null,
      hasAvailable: true,
      recipientId: props.recipientId || null,
      senderId: props.senderId || null
    };
  }

  public render (): React.ReactNode {
    const { assets, className, onClose, recipientId: propRecipientId, senderId: propSenderId, t } = this.props;
    const { extrinsic, hasAvailable, recipientId, senderId, assetId } = this.state;
    const available = <span className='label'>{t('available ')}</span>;
    const options = assets
      ? Object.entries(assets)
        .map(([id, name]): { value: string; text: string } => ({
          value: id,
          text: `${name} (${id})`
        }))
      : [];

    return (
      <div>
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
          <Dropdown
            allowAdd
            help={t('Enter the Asset ID of the token you want to transfer.')}
            label={t('asset id')}
            onChange={this.onChangeAssetId}
            options={options}
            onAdd={this.onAddAssetId}
            value={assetId}
          />
          <InputBalance
            help={t('Type the amount you want to transfer. Note that you can select the unit on the right e.g sending 1 mili is equivalent to sending 0.001.')}
            isError={!hasAvailable}
            label={t('amount')}
            onChange={this.onChangeAmount}
          />
          <Checks
            accountId={senderId}
            extrinsic={extrinsic}
            isSendable
            onChange={this.onChangeFees}
          />
        </div>
        <Button.Group>
          <TxButton
            accountId={senderId}
            extrinsic={extrinsic}
            isDisabled={!hasAvailable}
            isPrimary
            label={t('Make Transfer')}
            icon='send'
            onStart={onClose}
            withSpinner={false}
          />
        </Button.Group>
      </div>
    );
  }

  private nextState (newState: Partial<State>): void {
    this.setState((prevState: State): State => {
      const { api } = this.props;
      const {
        amount = prevState.amount,
        recipientId = prevState.recipientId,
        hasAvailable = prevState.hasAvailable,
        senderId = prevState.senderId,
        assetId = prevState.assetId
      } = newState;
      const extrinsic = recipientId && senderId
        ? api.tx.genericAsset.transfer(assetId, recipientId, amount)
        : null;

      return {
        assetId,
        amount,
        extrinsic,
        hasAvailable,
        recipientId,
        senderId
      };
    });
  }

  private onChangeAmount = (amount: BN = new BN(0)): void => {
    this.nextState({ amount });
  }

  private onChangeFrom = (senderId: string): void => {
    this.nextState({ senderId });
  }

  private onChangeTo = (recipientId: string): void => {
    this.nextState({ recipientId });
  }

  private onChangeFees = (hasAvailable: boolean): void => {
    this.setState({ hasAvailable });
  }

  private onChangeAssetId = (assetId: string): void => {
    this.nextState({ assetId });
  }

  private onAddAssetId = (id: string): void => {
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    if (id.trim().match(/^\d+$/)) {
      assetRegistry.add(id, id);
    }
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
  withObservable(assetRegistry.subject, { propName: 'assets' })
);
