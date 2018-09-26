// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/util-keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';

import FileSaver from 'file-saver';
import React from 'react';
import Button from '@polkadot/ui-app/Button';
import Modal from '@polkadot/ui-app/Modal';
import Password from '@polkadot/ui-app/Password';
import AddressSummary from '@polkadot/ui-app/AddressSummary';

import translate from './translate';

type Props = I18nProps & {
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
        size='tiny'
        dimmer='inverted'
        open
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
      <Modal.Content key='content'>
        <AddressSummary
          className='accounts--Modal-Address'
          value={pair.address()}
        />
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
    const { onClose, pair } = this.props;
    const { password } = this.state;

    if (!pair) {
      return;
    }

    try {
      if (!pair.isLocked()) {
        pair.lock();
      }

      pair.decodePkcs8(password);
    } catch (error) {
      this.setState({ isPassValid: false });
      return;
    }

    try {
      const json = JSON.stringify(pair.toJson(password));
      const blob = new Blob([json], { type: 'application/json; charset=utf-8' });

      FileSaver.saveAs(blob, `${pair.address()}.json`);
    } catch (error) {
      this.setState({ isPassValid: false });
      return;
    }

    onClose();
  }

  private onChangePass = (password: string) => {
    this.setState({
      isPassValid: password.length > 0 && password.length <= 32,
      password
    });
  }
}

export default translate(Backup);
