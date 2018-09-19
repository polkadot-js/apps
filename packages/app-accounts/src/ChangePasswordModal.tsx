// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
import { I18nProps, FormErrors, BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import classes from '@polkadot/ui-app/util/classes';
import AddressMini from '@polkadot/ui-app/AddressMini';
import AddressSummary from '@polkadot/ui-app/AddressSummary';
import Button from '@polkadot/ui-app/Button';
import CopyButton from '@polkadot/ui-app/CopyButton';
import Modal from '@polkadot/ui-app/Modal';
import Notification from '@polkadot/ui-app/Notification';
import keyring from '@polkadot/ui-keyring/index';
import Unlock from '@polkadot/ui-signer/Unlock';

import translate from './translate';

type Props = I18nProps & BareProps & {
  address: string,
  error: FormErrors,
  handleChangeAccountPassword: () => void,
  hidePasswordModal: () => void,
  isPasswordModalOpen: boolean,
  onChangeNewPassword: (newPassword: string) => void,
  onChangePassword: (password: string) => void,
  onDiscard: () => void,
  newPassword: string,
  password: string,
  success?: React.ReactNode
};

class ChangePasswordModal extends React.PureComponent<Props> {
  render () {
    const { address, className, error, hidePasswordModal, isPasswordModalOpen, style, success, t } = this.props;
    const { formError } = error;

    return (
      <Modal
        className={classes('accounts--ChangePassword-Modal', className)}
        dimmer='inverted'
        onClose={hidePasswordModal}
        open={isPasswordModalOpen}
        size='mini'
        style={style}
      >
        <Modal.Header key='header'>
          {t('account.change.password', {
            defaultValue: 'Change Password'
          })}
        </Modal.Header>,
        <Modal.Content>
          <div className='accounts--ChangePassword-Modal-Content-wrapper ui--grid'>
            <div className='accounts--ChangePassword-Modal-Content'>
              <AddressMini
                isShort
                value={address}
              >
                <CopyButton />
              </AddressMini>
              <AddressSummary
                withBalance={false}
                withNonce={false}
                value={address}
              />
              <div className='accounts--ChangePassword-Modal-Content-message expanded'>
                <p>
                  {t('unlock.info', {
                    defaultValue: 'Please enter your existing account password and new account password to unlock and change it.'
                  })}
                </p>
              </div>
              {this.renderContentPassword()}
              {this.renderContentNewPassword()}
            </div>
            {this.renderButtons()}
            <Notification
              error={formError}
              success={success}
            />
          </div>
        </Modal.Content>
      </Modal>
    );
  }

  renderContentPassword () {
    const { address, error: { inputError }, onChangePassword, password, t } = this.props;
    const passwordError = inputError && inputError.hasOwnProperty('password')
      ? inputError.password
      : undefined;

    if (!address) {
      return null;
    }

    const keyringAddress = keyring.getAddress(address);

    return (
      <Unlock
        autoFocus
        error={passwordError}
        label={t('unlock.password', {
          defaultValue: 'existing password to unlock your account'
        })}
        onChange={onChangePassword}
        onKeyDown={this.onKeyDown}
        password={password}
        tabIndex={1}
        value={keyringAddress.publicKey()}
      />
    );
  }

  renderContentNewPassword () {
    const { address, error: { inputError }, onChangeNewPassword, newPassword, t } = this.props;
    const newPasswordError = inputError && inputError.hasOwnProperty('newPassword')
      ? inputError.newPassword
      : undefined;

    if (!address) {
      return null;
    }

    const keyringAddress = keyring.getAddress(address);

    return (
      <Unlock
        error={newPasswordError}
        label={t('unlock.password.new', {
          defaultValue: 'new password for your account'
        })}
        onChange={onChangeNewPassword}
        onKeyDown={this.onKeyDown}
        password={newPassword}
        tabIndex={2}
        value={keyringAddress.publicKey()}
      />
    );
  }

  renderButtons () {
    const { error: { inputError }, handleChangeAccountPassword, newPassword, onDiscard, password, t } = this.props;
    const emptyInputValues = !password || !newPassword;
    const isInputError = !!inputError.password || !!inputError.newPassword;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={onDiscard}
            tabIndex={4}
            text={t('creator.discard', {
              defaultValue: 'Cancel'
            })}
          />
          <Button.Or />
          <Button
            className='ui--Button-submit'
            isDisabled={emptyInputValues || isInputError}
            isPrimary
            onClick={handleChangeAccountPassword}
            tabIndex={3}
            text={t('creator.submit', {
              defaultValue: 'Submit'
            })}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  onKeyDown = (event: React.KeyboardEvent<Element>): void => {
    const isSpacebar = event.keyCode === 32;

    if (isSpacebar) {
      event.preventDefault();
    }
  }
}

export {
  ChangePasswordModal
};

export default translate(ChangePasswordModal);
