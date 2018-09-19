// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/util-keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import Button from '@polkadot/ui-app/Button';
import Modal from '@polkadot/ui-app/Modal';
import Password from '@polkadot/ui-app/Password';
import AddressSummary from '@polkadot/ui-app/AddressSummary';
import keyring from '@polkadot/ui-keyring/index';

import translate from './translate';

type Props = I18nProps & {
  account: KeyringPair,
  onClose: () => void
};

type State = {
  isNewValid: boolean,
  isOldValid: boolean,
  newPass: string,
  oldPass: string
};

class ChangePass extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      isNewValid: false,
      isOldValid: false,
      newPass: '',
      oldPass: ''
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

  private renderButtons () {
    const { onClose, t } = this.props;
    const { isNewValid, isOldValid } = this.state;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={onClose}
            text={t('change.close', {
              defaultValue: 'Cancel'
            })}
          />
          <Button.Or />
          <Button
            isDisabled={!isNewValid || !isOldValid}
            isPrimary
            onClick={this.doChange}
            text={t('change.change', {
              defaultValue: 'Change'
            })}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  private renderContent () {
    const { account, t } = this.props;
    const { isNewValid, isOldValid, newPass, oldPass } = this.state;

    return [
      <Modal.Header key='header'>
        {t('change.header', {
          defaultValue: 'Change account password'
        })}
      </Modal.Header>,
      <Modal.Content key='content'>
        <AddressSummary
          className='accounts--Modal-Address'
          value={account.address()}
        />
        <div className='ui--row'>
          <Password
            autoFocus
            isError={!isOldValid}
            label={t('change.old', { defaultValue: 'old password' })}
            onChange={this.onChangeOld}
            tabIndex={1}
            value={oldPass}
          />
          <Password
            isError={!isNewValid}
            label={t('change.new', { defaultValue: 'new password' })}
            onChange={this.onChangeNew}
            tabIndex={2}
            value={newPass}
          />
        </div>
      </Modal.Content>
    ];
  }

  private doChange = (): void => {
    const { account, onClose } = this.props;
    const { newPass, oldPass } = this.state;

    try {
      if (!account.isLocked()) {
        account.lock();
      }

      account.decodePkcs8(oldPass);
    } catch (error) {
      this.setState({ isOldValid: false });
      return;
    }

    try {
      keyring.encryptAccount(account, newPass);
    } catch (error) {
      this.setState({ isNewValid: false });
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
    return password.length > 0 && password.length <= 32;
  }
}

export default translate(ChangePass);
