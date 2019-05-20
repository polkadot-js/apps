// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActionStatus } from '@polkadot/ui-app/Status/types';
import { I18nProps } from './types';

import React from 'react';
import styled from 'styled-components';

import { AddressSummary, Available, Balance, Bonded, Button, CryptoType, Nonce, Unlocking } from '@polkadot/ui-app';
import keyring from '@polkadot/ui-keyring';

import Backup from './modals/Backup';
import ChangePass from './modals/ChangePass';
import Forgetting from './modals/Forgetting';
import translate from './translate';

type Props = I18nProps & {
  accountId: string
};

type State = {
  isBackupOpen: boolean,
  isForgetOpen: boolean,
  isPasswordOpen: boolean
};

const Wrapper = styled.article`
  position: relative;
  flex: 1 1;
  min-width: 32%;
  max-width: 32%;
  justify-content: space-around;

  .ui--AddressSummary {
    justify-content: space-around;
  }

  .ui--AddressSummary-base{
    flex: 3;
    padding: 0;
  }
  .ui--AddressSummary-children {
    flex: 4;
  }

  .account--Account-balances {
    display: grid;
    grid-column-gap: 1em;
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
    font-weight: bold;
  }

  @media (max-width: 1530px) {
      min-width: 49%;
      max-width: 49%;
  }
`;

class Account extends React.PureComponent<Props> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      isBackupOpen: false,
      isForgetOpen: false,
      isPasswordOpen: false
    };
  }

  render () {
    const { accountId } = this.props;

    return (
      <Wrapper className='overview--Account'>
        {this.renderModals()}
        <AddressSummary
          value={accountId}
          identIconSize={96}
          isEditable
          withBalance={false}
          withNonce={false}
          withTags
        >
          <div className='account--Account-expand'>
            <div className='account--Account-balances'>
              {this.renderTotal()}
              {this.renderAvailable()}
              {this.renderBonded()}
              {this.renderUnlocking()}
              <br/>
              {this.renderNonce()}
              {this.renderCryptoType()}
            </div>
            {this.renderButtons()}
          </div>
        </AddressSummary>
      </Wrapper>
    );
  }

  private renderAvailable () {
    const { accountId, t } = this.props;

    return (
      <Available
        className='accounts--Account-balances-available'
        label={t('available')}
        params={accountId}
      />
    );
  }

  private renderBonded () {
    const { accountId, t } = this.props;

    return (
      <Bonded
        className='accounts--Account-balances-bonded'
        label={t('bonded')}
        params={accountId}
      />
    );
  }

  private renderCryptoType () {
    const { accountId, t } = this.props;

    return (
      <CryptoType
        accountId={accountId}
        className='accounts--Account-details-crypto'
        label={t('crypto type')}
      />
    );
  }

  private renderModals () {
    const { accountId } = this.props;
    const { isBackupOpen, isForgetOpen, isPasswordOpen } = this.state;

    if (!accountId) {
      return null;
    }

    const modals = [];

    if (isBackupOpen) {
      modals.push(
        <Backup
          key='modal-backup-account'
          onClose={this.toggleBackup}
          address={accountId}
        />
      );
    }

    if (isForgetOpen) {
      modals.push(
        <Forgetting
          address={accountId}
          doForget={this.onForget}
          key='modal-forget-account'
          onClose={this.toggleForget}
        />
      );
    }

    if (isPasswordOpen) {
      modals.push(
        <ChangePass
          address={accountId}
          key='modal-change-pass'
          onClose={this.togglePass}
        />
      );
    }

    return modals;
  }

  private toggleBackup = (): void => {
    this.setState(
      ({ isBackupOpen }: State) => ({
        isBackupOpen: !isBackupOpen
      })
    );
  }

  private toggleForget = (): void => {
    this.setState(
      ({ isForgetOpen }: State) => ({
        isForgetOpen: !isForgetOpen
      })
    );
  }

  private togglePass = (): void => {
    const {isPasswordOpen} = this.state;

    this.setState({
      isPasswordOpen: !isPasswordOpen
    });
  }

  private onForget = (): void => {
    const { accountId, t } = this.props;

    if (!accountId) {
      return;
    }

    const status = {
      account: accountId,
      action: 'forget'
    } as ActionStatus;

    try {
      keyring.forgetAccount(accountId);
      status.status = 'success';
      status.message = t('account forgotten');
    } catch (error) {
      status.status = 'error';
      status.message = error.message;
    }
  }

  private renderNonce () {
    const { accountId, t } = this.props;

    return (
      <Nonce
        className='accounts--Account-details-nonce'
        params={accountId}
        label={t('transactions')}
      />
    );
  }

  private renderTotal () {
    const { accountId, t } = this.props;

    return (
      <Balance
        className='accounts--Account-balances-balance'
        label={t('total')}
        params={accountId}
      />
    );
  }

  private renderUnlocking () {
    const { accountId } = this.props;

    return (
      <Unlocking
        className='accounts--Account-balances-unlocking'
        params={accountId}
      />
    );
  }

  private renderButtons () {
    const { t } = this.props;;

    return (
      <Button.Group>
        <Button
          isNegative
          onClick={this.toggleForget}
          label={t('Forget')}
        />
        <Button.Group.Divider />
        <Button
          onClick={this.toggleBackup}
          label={t('Backup')}
        />
        <Button.Or />
        <Button
          onClick={this.togglePass}
          label={t('Change Password')}
        />
      </Button.Group>
    );
  }
}

export default translate(Account);
