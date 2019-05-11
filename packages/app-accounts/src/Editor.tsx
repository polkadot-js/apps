// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ComponentProps } from './types';

import React from 'react';
import { AddressSummary, Button, Dropdown, Input, InputAddress } from '@polkadot/ui-app';
import keyring from '@polkadot/ui-keyring';
import uiSettings from '@polkadot/ui-settings';

import Backup from './modals/Backup';
import ChangePass from './modals/ChangePass';
import Forgetting from './modals/Forgetting';
import translate from './translate';

type Props = ComponentProps & I18nProps & {
  allAccounts?: SubjectInfo
};

type State = {
  current: KeyringPair | null,
  editedName: string,
  isBackupOpen: boolean,
  isEdited: boolean,
  isForgetOpen: boolean,
  isPasswordOpen: boolean
};

class Editor extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.createState(null);
  }

  render () {
    return (
      <div className='accounts--Editor'>
        {this.renderModals()}
        {this.renderData()}
        {this.renderButtons()}
      </div>
    );
  }

  renderButtons () {
    const { t } = this.props;
    const { current, isEdited } = this.state;

    if (!current || current.getMeta().isTesting) {
      return null;
    }

    return (
      <Button.Group>
        <Button
          isNegative
          onClick={this.toggleForget}
          label={t('Forget')}
        />
        <Button.Group.Divider />
        <Button
          isDisabled={isEdited}
          onClick={this.toggleBackup}
          label={t('Backup')}
        />
        <Button.Or />
        <Button
          isDisabled={isEdited}
          onClick={this.togglePass}
          label={t('Change Password')}
        />
        <Button.Group.Divider />
        <Button
          isDisabled={!isEdited}
          onClick={this.onDiscard}
          label={t('Reset')}
        />
        <Button.Or />
        <Button
          isDisabled={!isEdited}
          isPrimary
          onClick={this.onCommit}
          label={t('Save')}
        />
      </Button.Group>
    );
  }

  renderData () {
    const { t } = this.props;
    const { current, editedName } = this.state;

    const address = current
      ? current.address()
      : undefined;
    const type = current
      ? current.type
      : 'ed25519';

    return (
      <div className='ui--grid'>
        <AddressSummary
          className='shrink'
          value={address || ''}
        />
        <div className='grow'>
          <div className='ui--row'>
            <InputAddress
              className='full'
              help={t('Select the account you wish to edit.')}
              hideAddress
              isInput={false}
              label={t('account')}
              onChange={this.onChangeAccount}
              type='account'
              value={address}
            />
          </div>
          <div className='ui--row'>
            <Input
              className='full'
              help={t('Name given to this account. You can edit it. To use the account to validate or nominate, it is a good practice to append the function of the account in the name, e.g "name_you_want - stash".')}
              isEditable
              label={t('name')}
              onChange={this.onChangeName}
              value={editedName}
            />
          </div>
          <div className='ui--row'>
            <Dropdown
              defaultValue={type}
              help={t('Cryptography used to create this account. It cannot be changed after the account creation. Note that a stash account must use ed25519.')}
              isDisabled
              label={t('keypair crypto type')}
              options={uiSettings.availableCryptos}
            />
          </div>
        </div>
      </div>
    );
  }

  renderModals () {
    const { onStatusChange } = this.props;
    const { current, isBackupOpen, isForgetOpen, isPasswordOpen } = this.state;

    if (!current) {
      return null;
    }

    const address = current.address();
    const modals = [];

    if (isBackupOpen) {
      modals.push(
        <Backup
          key='modal-backup-account'
          onClose={this.toggleBackup}
          onStatusChange={onStatusChange}
          pair={current}
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
          account={current}
          key='modal-change-pass'
          onClose={this.togglePass}
          onStatusChange={onStatusChange}
        />
      );
    }

    return modals;
  }

  createState (current: KeyringPair | null): State {
    return {
      current,
      editedName: current
        ? current.getMeta().name || ''
        : '',
      isBackupOpen: false,
      isEdited: false,
      isForgetOpen: false,
      isPasswordOpen: false
    };
  }

  nextState (newState: State = {} as State): void {
    this.setState(
      (prevState: State): State => {
        let { current = prevState.current, editedName = prevState.editedName } = newState;
        const previous = prevState.current || { address: () => undefined };
        let isEdited = false;

        if (current) {
          if (current.address() !== previous.address()) {
            editedName = current.getMeta().name || '';
          } else if (editedName !== current.getMeta().name) {
            isEdited = true;
          }
        } else {
          editedName = '';
        }

        return {
          current,
          editedName,
          isBackupOpen: false,
          isEdited,
          isForgetOpen: false,
          isPasswordOpen: false
        };
      }
    );
  }

  onChangeAccount = (accountId?: string): void => {
    const current = accountId
        ? keyring.getPair(accountId)
        : null;

    this.nextState({
      current
    } as State);
  }

  onChangeName = (editedName: string): void => {
    this.nextState({ editedName } as State);
  }

  onCommit = (): void => {
    const { onStatusChange, t } = this.props;
    const { current, editedName } = this.state;

    if (!current) {
      return;
    }

    const status = {
      account: current.address(),
      action: 'edit'
    } as ActionStatus;

    try {
      keyring.saveAccountMeta(current, {
        name: editedName,
        whenEdited: Date.now()
      });

      status.status = current.getMeta().name === editedName ? 'success' : 'error';
      status.message = t('name edited');
    } catch (error) {
      status.status = 'error';
      status.message = error.message;
    }

    onStatusChange(status);

    this.nextState({} as State);
  }

  onDiscard = (): void => {
    const { current } = this.state;

    if (!current) {
      return;
    }

    this.nextState({
      editedName: current.getMeta().name
    } as State);
  }

  toggleBackup = (): void => {
    this.setState(
      ({ isBackupOpen }: State) => ({
        isBackupOpen: !isBackupOpen
      })
    );
  }

  toggleForget = (): void => {
    this.setState(
      ({ isForgetOpen }: State) => ({
        isForgetOpen: !isForgetOpen
      })
    );
  }

  togglePass = (): void => {
    this.setState(
      ({ current, isPasswordOpen }: State) => {
        if (!current) {
          return null;
        }

        // NOTE We re-get the account from the keyring, if changed it will load the
        // new instance (this is not quite obvious...)
        return {
          current: keyring.getPair(current.publicKey()),
          isPasswordOpen: !isPasswordOpen
        };
      }
    );
  }

  onForget = (): void => {
    const { onStatusChange, t } = this.props;
    const { current } = this.state;

    if (!current) {
      return;
    }

    this.setState(
      this.createState(null),
      () => {
        const status = {
          account: current.address(),
          action: 'forget'
        } as ActionStatus;

        try {
          keyring.forgetAccount(
            current.address()
          );
          status.status = 'success';
          status.message = t('account forgotten');
        } catch (error) {
          status.status = 'error';
          status.message = error.message;
        }

        onStatusChange(status);
      }
    );
  }
}

export default translate(Editor);
