// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';

import FileSaver from 'file-saver';
import React from 'react';
import { AddressSummary, Button, Modal, Password } from '@polkadot/ui-app/index';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import keyring from '@polkadot/ui-keyring';

import translate from './translate';

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
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      isPassValid: false,
      password: ''
    };
  }

  render () {
    return (
      <Modal
        className='app--accounts-Modal'
        dimmer='inverted'
        open
        size='tiny'
      >
        {this.renderContent()}
        {this.renderButtons()}
      </Modal>
    );
  }

  renderButtons () {
    const { onClose, t } = this.props;
    const { isPassValid } = this.state;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={onClose}
            text={t('backup.close', {
              defaultValue: 'Cancel'
            })}
          />
          <Button.Or />
          <Button
            isDisabled={!isPassValid}
            isPrimary
            onClick={this.doBackup}
            text={t('backup.download', {
              defaultValue: 'Download'
            })}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  renderContent () {
    const { pair, t } = this.props;
    const { isPassValid, password } = this.state;

    return [
      <Modal.Header key='header'>
        {t('backup.header', {
          defaultValue: 'Backup account'
        })}
      </Modal.Header>,
      <Modal.Content
        className='app--account-Backup-content'
        key='content'
      >
        <AddressSummary value={pair.address()} />
        <div className='ui--row'>
          <Password
            isError={!isPassValid}
            label={t('backup.password', {
              defaultValue: 'unlock account using the password'
            })}
            onChange={this.onChangePass}
            tabIndex={0}
            value={password}
          />
        </div>
      </Modal.Content>
    ];
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

      status.value = pair.address();
      status.status = blob ? 'success' : 'error';
      status.message = t('status.backup', {
        defaultValue: 'account backed up'
      });

      FileSaver.saveAs(blob, `${pair.address()}.json`);
    } catch (error) {
      this.setState({ isPassValid: false });
      console.error(error);

      status.status = 'error';
      status.message = t('status.error', {
        defaultValue: error.message
      });
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
