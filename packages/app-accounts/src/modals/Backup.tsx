// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import FileSaver from 'file-saver';
import React from 'react';
import { AddressRow, Button, Modal, Password, TxComponent } from '@polkadot/react-components';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import keyring from '@polkadot/ui-keyring';

import translate from '../translate';

interface Props extends I18nProps {
  onClose: () => void;
  address: string;
}

interface State {
  isPassValid: boolean;
  password: string;
}

class Backup extends TxComponent<Props, State> {
  public state: State = {
    isPassValid: false,
    password: ''
  };

  public render (): React.ReactNode {
    const { t } = this.props;

    return (
      <Modal
        className='app--accounts-Modal'
        dimmer='inverted'
        open
      >
        <Modal.Header>{t('Backup account')}</Modal.Header>
        {this.renderContent()}
        {this.renderButtons()}
      </Modal>
    );
  }

  private renderButtons (): React.ReactNode {
    const { onClose, t } = this.props;
    const { isPassValid } = this.state;

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
            isDisabled={!isPassValid}
            isPrimary
            label={t('Download')}
            onClick={this.doBackup}
            ref={this.button}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  private renderContent (): React.ReactNode {
    const { address, t } = this.props;
    const { isPassValid, password } = this.state;

    return (
      <Modal.Content>
        <AddressRow
          isInline
          value={address}
        >
          <p>{t('An encrypted backup file will be created once you have pressed the "Download" button. This can be used to re-import your account on any other machine.')}</p>
          <p>{t('Save this backup file in a secure location. Additionally, the password associated with this account is needed together with this backup file in order to restore your account.')}</p>
          <div>
            <Password
              help={t('The account password as specified when creating the account. This is used to encrypt the backup file and subsequently decrypt it when restoring the account.')}
              isError={!isPassValid}
              label={t('password')}
              onChange={this.onChangePass}
              onEnter={this.submit}
              tabIndex={0}
              value={password}
            />
          </div>
        </AddressRow>
      </Modal.Content>
    );
  }

  private doBackup = (): void => {
    const { onClose, address, t } = this.props;
    const { password } = this.state;

    if (!address) {
      return;
    }

    const status: Partial<ActionStatus> = {
      action: 'backup'
    };

    try {
      const addressKeyring = address && keyring.getPair(address);
      const json = addressKeyring && keyring.backupAccount(addressKeyring, password);
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

      status.account = address;
      status.status = blob ? 'success' : 'error';
      status.message = t('account backed up');

      FileSaver.saveAs(blob, `${address}.json`);
    } catch (error) {
      this.setState({ isPassValid: false });
      console.error(error);

      status.status = 'error';
      status.message = error.message;
      return;
    }

    onClose();
  }

  private onChangePass = (password: string): void => {
    this.setState({
      isPassValid: keyring.isPassValid(password),
      password
    });
  }
}

export default translate(Backup);
