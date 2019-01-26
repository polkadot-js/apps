// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { AddressSummary, Button, Modal, Password } from '@polkadot/ui-app/index';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import keyring from '@polkadot/ui-keyring';

import translate from './translate';

type Props = I18nProps & {
  account: KeyringPair,
  onClose: () => void,
  onStatusChange: (status: ActionStatus) => void
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

  private renderButtons () {
    const { onClose, t } = this.props;
    const { isNewValid, isOldValid } = this.state;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={onClose}
            text={t('Cancel')}
          />
          <Button.Or />
          <Button
            isDisabled={!isNewValid || !isOldValid}
            isPrimary
            onClick={this.doChange}
            text={t('Change')}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  private renderContent () {
    const { account, t } = this.props;
    const { isNewValid, isOldValid, newPass, oldPass } = this.state;

    return (
      <>
        <Modal.Header>
          {t('Change account password')}
        </Modal.Header>
        <Modal.Content>
          <AddressSummary value={account.address()} />
          <div className='ui--row'>
            <Password
              autoFocus
              isError={!isOldValid}
              label={t('old password')}
              onChange={this.onChangeOld}
              tabIndex={1}
              value={oldPass}
            />
            <Password
              isError={!isNewValid}
              label={t('new password')}
              onChange={this.onChangeNew}
              tabIndex={2}
              value={newPass}
            />
          </div>
        </Modal.Content>
      </>
    );
  }

  private doChange = (): void => {
    const { account, onClose, onStatusChange, t } = this.props;
    const { newPass, oldPass } = this.state;

    const status = {
      action: 'changePassword'
    } as ActionStatus;

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

      status.account = account.address();
      status.status = 'success';
      status.message = t('password changed');
    } catch (error) {
      this.setState({ isNewValid: false });

      status.status = 'error';
      status.message = error.message;

      return;
    }

    onStatusChange(status);

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
