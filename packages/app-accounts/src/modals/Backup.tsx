// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';

import FileSaver from 'file-saver';
import React from 'react';
import { AddressRow, Button, Modal, Password } from '@polkadot/ui-app';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import keyring from '@polkadot/ui-keyring';

import translate from '../translate';

type Props = I18nProps & {
  onStatusChange: (status: ActionStatus) => void,
  onClose: () => void,
  pair: KeyringPair
};

type State = {
  isPassValid: boolean,
  password: string
};

class Backup extends React.PureComponent<Props, State> {
  state: State = {
    isPassValid: false,
    password: ''
  };

  render () {
    return (
      <Modal
        className='app--accounts-Modal'
        dimmer='inverted'
        open
      >
        {this.renderContent()}
        {this.renderButtons()}
      </Modal>
    );
  }

  private renderButtons () {
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
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  private renderContent () {
    const { pair, t } = this.props;
    const { isPassValid, password } = this.state;

    return (
      <>
        <Modal.Header>
          {t('Backup account')}
        </Modal.Header>
        <Modal.Content className='app--account-Backup-content'>
          <AddressRow
            isInline
            value={pair.address()}
          >
            <p>{t('An encrypted backup file will be created once you have pressed the "Download" button. This can be used to re-import your account on any other machine.')}</p>
            <p>{t('Save this backup file in a secure location. Additionally, the password associated with this account is needed together with this backup file in order to restore your account.')}</p>
            <div>
              <Password
                help={t('The account password as specified when creating the account. This is used to encrypt the backup file and subsequently decrypt it when restoring the account.')}
                isError={!isPassValid}
                label={t('password')}
                onChange={this.onChangePass}
                tabIndex={0}
                value={password}
              />
            </div>
          </AddressRow>
        </Modal.Content>
      </>
    );
  }

  private doBackup = (): void => {
    const { onClose, onStatusChange, pair, t } = this.props;
    const { password } = this.state;

    if (!pair) {
      return;
    }

    const status = {
      action: 'backup'
    } as ActionStatus;

    try {
      const json = keyring.backupAccount(pair, password);
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

      status.account = pair.address();
      status.status = blob ? 'success' : 'error';
      status.message = t('account backed up');

      FileSaver.saveAs(blob, `${pair.address()}.json`);
    } catch (error) {
      this.setState({ isPassValid: false });
      console.error(error);

      status.status = 'error';
      status.message = error.message;
      return;
    }

    onStatusChange(status);

    onClose();
  }

  private onChangePass = (password: string) => {
    this.setState({
      isPassValid: keyring.isPassValid(password),
      password
    });
  }
}

export default translate(Backup);
