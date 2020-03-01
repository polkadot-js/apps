// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { AddressRow, Button, Modal, Password, TxComponent } from '@polkadot/react-components';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import keyring from '@polkadot/ui-keyring';

import translate from '../translate';

interface Props extends I18nProps {
  address: string;
  onClose: () => void;
}

interface State {
  isNewValid: boolean;
  isOldValid: boolean;
  newPass: string;
  oldPass: string;
}

class ChangePass extends TxComponent<Props, State> {
  public state: State = {
    isNewValid: false,
    isOldValid: false,
    newPass: '',
    oldPass: ''
  };

  public render (): React.ReactNode {
    const { t } = this.props;

    return (
      <Modal
        className='app--accounts-Modal'
        header={t('Change account password')}
      >
        {this.renderContent()}
        {this.renderButtons()}
      </Modal>
    );
  }

  private renderButtons (): React.ReactNode {
    const { onClose, t } = this.props;
    const { isNewValid, isOldValid } = this.state;

    return (
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='sign-in'
          isDisabled={!isNewValid || !isOldValid}
          isPrimary
          label={t('Change')}
          onClick={this.doChange}
        />
      </Modal.Actions>
    );
  }

  private renderContent (): React.ReactNode {
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
    const status: Partial<ActionStatus> = {
      action: 'changePassword'
    };

    try {
      const account = address && keyring.getPair(address);

      if (!account) {
        status.message = t(`No keypair found for this address ${address}`);

        return;
      }

      try {
        if (!account.isLocked) {
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

  private onChangeNew = (newPass: string): void => {
    this.setState({
      isNewValid: this.validatePass(newPass),
      newPass
    });
  }

  private onChangeOld = (oldPass: string): void => {
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
