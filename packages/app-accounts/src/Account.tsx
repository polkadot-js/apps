// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActionStatus } from '@polkadot/ui-app/Status/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import styled from 'styled-components';
import { AddressSummary, Available, Balance, Bonded, Button, CryptoType, Icon, Nonce, Unlocking } from '@polkadot/ui-app';
import keyring from '@polkadot/ui-keyring';

import Backup from './modals/Backup';
import ChangePass from './modals/ChangePass';
import Forgetting from './modals/Forgetting';
import Transfer from './modals/Transfer';

import translate from './translate';

type Props = I18nProps & {
  address: string
};

type State = {
  isBackupOpen: boolean,
  isEditable: boolean,
  isForgetOpen: boolean,
  isPasswordOpen: boolean,
  isTransferOpen: boolean
};

const Wrapper = styled.article`
  position: relative;
  flex: 1 1;
  min-width: 24%;
  max-width: 24%;
  justify-content: space-around;

  .accounts--Account-buttons {
    text-align: right;
    margin-bottom: 2em;
  }

  .ui--AddressSummary {
    justify-content: space-around;
  }

  .ui--AddressSummary-base {
    flex: 1;
    padding: 0;
  }
  .ui--AddressSummary-children {
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
  }

  .account--Account-balances {
    display: grid;
    grid-column-gap: .5em;
    color: #4e4e4e;
    opacity: 1;
  }

  .label-available,
  .label-balance,
  .label-bonded,
  .label-cryptotype,
  .label-locked,
  .label-nonce,
  .label-redeemable {
    grid-column:  1;
    text-align: right;
  }

  .result-available,
  .result-balance,
  .result-bonded,
  .result-cryptotype,
  .result-locked,
  .result-nonce,
  .result-redeemable {
    grid-column:  2;
  }

  .accounts--Account-buttons > button {
    margin: .2em;
  }

  @media (max-width: 2060px) {
    min-width: 32%;
    max-width: 32%;
  }

  @media (max-width: 1580px) {
      min-width: 49%;
      max-width: 49%;
  }

  @media (max-width: 1100px) {
    min-width: 100%;
    max-width: 100%;
  }
`;

class Account extends React.PureComponent<Props> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      isBackupOpen: false,
      isEditable: !(keyring.getAccount(props.address).getMeta().isInjected),
      isForgetOpen: false,
      isPasswordOpen: false,
      isTransferOpen: false
    };
  }

  render () {
    const { address } = this.props;
    const { isEditable } = this.state;

    // FIXME It is a bit heavy-handled switching of being editable here completely
    // (and removing the tags, however the keyring cannot save these)
    return (
      <Wrapper className='overview--Account'>
        {this.renderModals()}
        <AddressSummary
          value={address}
          identIconSize={96}
          isEditable={isEditable}
          withBalance={false}
          withNonce={false}
          withTags
        >
          <div className='account--Account-expand'>
            {this.renderButtons()}
            <div className='account--Account-balances'>
              {this.renderTotal()}
              {this.renderAvailable()}
              {this.renderBonded()}
              {this.renderUnlocking()}
              <br/>
              {this.renderNonce()}
              {this.renderCryptoType()}
            </div>
          </div>
        </AddressSummary>
      </Wrapper>
    );
  }

  private renderAvailable () {
    const { address, t } = this.props;

    return (
      <Available
        className='accounts--Account-balances-available'
        label={t('available')}
        params={address}
      />
    );
  }

  private renderBonded () {
    const { address, t } = this.props;

    return (
      <Bonded
        className='accounts--Account-balances-bonded'
        label={t('bonded')}
        params={address}
      />
    );
  }

  private renderCryptoType () {
    const { address, t } = this.props;

    return (
      <CryptoType
        accountId={address}
        className='accounts--Account-details-crypto'
        label={t('crypto type')}
      />
    );
  }

  private renderModals () {
    const { address } = this.props;
    const { isBackupOpen, isForgetOpen, isPasswordOpen, isTransferOpen } = this.state;

    if (!address) {
      return null;
    }

    const modals = [];

    if (isBackupOpen) {
      modals.push(
        <Backup
          key='modal-backup-account'
          onClose={this.toggleBackup}
          address={address}
        />
      );
    }

    if (isForgetOpen) {
      modals.push(
        <Forgetting
          address={address}
          doForget={this.onForget}
          key='modal-forget-account'
          onClose={this.toggleForget}
        />
      );
    }

    if (isPasswordOpen) {
      modals.push(
        <ChangePass
          address={address}
          key='modal-change-pass'
          onClose={this.togglePass}
        />
      );
    }

    if (isTransferOpen) {
      modals.push(
        <Transfer
          address={address}
          key='modal-transfer'
          onClose={this.toggleTransfer}
        />
      );
    }

    return modals;
  }

  private toggleBackup = (): void => {
    const { isBackupOpen } = this.state;

    this.setState({
      isBackupOpen: !isBackupOpen
    });
  }

  private toggleForget = (): void => {
    const { isForgetOpen } = this.state;

    this.setState({
      isForgetOpen: !isForgetOpen
    });
  }

  private togglePass = (): void => {
    const { isPasswordOpen } = this.state;

    this.setState({
      isPasswordOpen: !isPasswordOpen
    });
  }

  private toggleTransfer = (): void => {
    const { isTransferOpen } = this.state;

    this.setState({
      isTransferOpen: !isTransferOpen
    });
  }

  private onForget = (): void => {
    const { address, t } = this.props;

    if (!address) {
      return;
    }

    const status = {
      account: address,
      action: 'forget'
    } as ActionStatus;

    try {
      keyring.forgetAccount(address);
      status.status = 'success';
      status.message = t('account forgotten');
    } catch (error) {
      status.status = 'error';
      status.message = error.message;
    }
  }

  private renderNonce () {
    const { address, t } = this.props;

    return (
      <Nonce
        className='accounts--Account-details-nonce'
        params={address}
        label={t('transactions')}
      />
    );
  }

  private renderTotal () {
    const { address, t } = this.props;

    return (
      <Balance
        className='accounts--Account-balances-balance'
        label={t('total')}
        params={address}
      />
    );
  }

  private renderUnlocking () {
    const { address } = this.props;

    return (
      <Unlocking
        className='accounts--Account-balances-unlocking'
        params={address}
      />
    );
  }

  private renderButtons () {
    const { t } = this.props;
    const { isEditable } = this.state;

    return (
      <div className='accounts--Account-buttons'>
        {isEditable && (
          <>
            <Button
              isNegative
              onClick={this.toggleForget}
              icon='trash'
              size='small'
              tooltip={t('Forget this account')}
            />
            <Button
              icon='cloud download'
              isPrimary
              onClick={this.toggleBackup}
              size='small'
              tooltip={t('Create a backup file for this account')}
            />
            <Button
              icon='key'
              isPrimary
              onClick={this.togglePass}
              size='small'
              tooltip={t("Change this account's password")}
            />
          </>
        )}
        <Button
          isPrimary
          label={<><Icon name='paper plane' /> {t('send')}</>}
          onClick={this.toggleTransfer}
          size='small'
          tooltip={t('Send funds from this account')}
        />
      </div>
    );
  }
}

export default translate(Account);
