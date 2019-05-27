// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { AddressRow, Button, Modal, Password, TxComponent } from '@polkadot/ui-app';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import keyring from '@polkadot/ui-keyring';

import translate from '../translate';

type Props = I18nProps & {
  address: string,
  onClose: () => void
};

type State = {
  isNewValid: boolean,
  isOldValid: boolean,
  newPass: string,
  oldPass: string
};

class ChangePass extends TxComponent<Props, State> {
  state: State = {
    isNewValid: false,
    isOldValid: false,
    newPass: '',
    oldPass: ''
  };

  render () {
    const { t } = this.props;

    return (
      <Modal
        className='app--accounts-Modal'
        dimmer='inverted'
        open
      >
        <Modal.Header>{t('Change account password')}</Modal.Header>
        {this.renderContent()}
        {this.renderButtons()}
      </Modal>
    );
  }

  private renderButtons () {
    const { onClose, t } = this.props;
    const { isNewValid, isOldValid } = this.state;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            label={t('Cancel')}
            onClick={onClose}
          />
          <Button.Or />
          <Button
            isDisabled={!isNewValid || !isOldValid}
            isPrimary
            label={t('Change')}
            onClick={this.doChange}
            ref={this.button}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  private renderContent () {
    const { address, t } = this.props;
    const { isNewValid, isOldValid, newPass, oldPass } = this.state;

    return (
      <Modal.Content>
        <AddressRow
          isInline
          value={address}
        >
          <p>{t('This will apply to any future use of this account as stored on this browser. Ensure that you securely store this new password and that it is strong and unique to the account.')}</p>
          <div>
            <Password
              autoFocus
              help={t('The existing account password as specified when this account was created or when it was last changed.')}
              isError={!isOldValid}
              label={t('your current password')}
              onChange={this.onChangeOld}
              tabIndex={1}
              value={oldPass}
            />
            <Password
              help={t('The new account password. Once set, all future account unlocks will be performed with this new password.')}
              isError={!isNewValid}
              label={t('your new password')}
              onChange={this.onChangeNew}
              onEnter={this.submit}
              tabIndex={2}
              value={newPass}
            />
          </div>
        </AddressRow>
      </Modal.Content>
    );
  }

  private doChange = (): void => {
    const { address, onClose, t } = this.props;
    const { newPass, oldPass } = this.state;
    const status = {
      action: 'changePassword'
    } as ActionStatus;

    try {
      const account = address && keyring.getPair(address);

      if (!account) {
        status.message = t(`No keypair found for this address ${address}`);

        return;
      }

      try {
        if (!account.isLocked()) {
          account.lock();
        }

        account.decodePkcs8(oldPass);
      } catch (error) {
        this.setState({ isOldValid: false });
        status.message = error.message;

        return;
      }

      try {
        keyring.encryptAccount(account, newPass);
        status.account = address;
        status.status = 'success';
        status.message = t('password changed');
      } catch (error) {
        this.setState({ isNewValid: false });
        status.status = 'error';
        status.message = error.message;

        return;
      }
    } catch (error) {
      status.message = error.message;

      return;
    }

    onClose();
  }

  private onChangeNew = (newPass: string) => {
    this.setState({
      isNewValid: this.validatePass(newPass),
      newPass
    });
  }

  private onChangeOld = (oldPass: string) => {
    this.setState({
      isOldValid: this.validatePass(oldPass),
      oldPass
    });
  }

  private validatePass (password: string): boolean {

    return keyring.isPassValid(password);
  }
}

export default translate(ChangePass);
