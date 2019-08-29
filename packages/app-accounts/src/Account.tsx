// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActionStatus } from '@polkadot/react-components/Status/types';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { AddressCard, AddressInfo, Button, Forget, Icon } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';

import Backup from './modals/Backup';
import ChangePass from './modals/ChangePass';
import Transfer from './modals/Transfer';

import translate from './translate';

interface Props extends I18nProps {
  address: string;
}

interface State {
  isBackupOpen: boolean;
  isEditable: boolean;
  isForgetOpen: boolean;
  isPasswordOpen: boolean;
  isTransferOpen: boolean;
}

class Account extends React.PureComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    const account = keyring.getAccount(props.address);

    this.state = {
      isBackupOpen: false,
      isEditable: account
        ? !(account.meta.isInjected)
        : false,
      isForgetOpen: false,
      isPasswordOpen: false,
      isTransferOpen: false
    };
  }

  public render (): React.ReactNode {
    const { address } = this.props;
    const { isEditable } = this.state;

    // FIXME It is a bit heavy-handled switching of being editable here completely
    // (and removing the tags, however the keyring cannot save these)
    return (
      <AddressCard
        buttons={this.renderButtons()}
        isEditable={isEditable}
        type='account'
        value={address}
        withExplorer
        withIndex
        withTags
      >
        {this.renderModals()}
        <AddressInfo
          address={address}
          withBalance
          withExtended
        />
      </AddressCard>
    );
  }

  private renderModals (): React.ReactNode {
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
        <Forget
          address={address}
          onForget={this.onForget}
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
          key='modal-transfer'
          onClose={this.toggleTransfer}
          senderId={address}
        />
      );
    }

    return modals;
  }

  private toggleBackup = (): void => {
    this.setState(({ isBackupOpen }: State): Pick<State, never> => ({
      isBackupOpen: !isBackupOpen
    }));
  }

  private toggleForget = (): void => {
    this.setState(({ isForgetOpen }: State): Pick<State, never> => ({
      isForgetOpen: !isForgetOpen
    }));
  }

  private togglePass = (): void => {
    this.setState(({ isPasswordOpen }: State): Pick<State, never> => ({
      isPasswordOpen: !isPasswordOpen
    }));
  }

  private toggleTransfer = (): void => {
    this.setState(({ isTransferOpen }: State): Pick<State, never> => ({
      isTransferOpen: !isTransferOpen
    }));
  }

  private onForget = (): void => {
    const { address, t } = this.props;

    if (!address) {
      return;
    }

    const status: Partial<ActionStatus> = {
      account: address,
      action: 'forget'
    };

    try {
      keyring.forgetAccount(address);
      status.status = 'success';
      status.message = t('account forgotten');
    } catch (error) {
      status.status = 'error';
      status.message = error.message;
    }
  }

  private renderButtons (): React.ReactNode {
    const { t } = this.props;
    const { isEditable } = this.state;

    return (
      <div className='accounts--Account-buttons buttons'>
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
