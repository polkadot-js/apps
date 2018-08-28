// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
import { I18nProps, FormErrorProps, BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Trans } from 'react-i18next';
import AddressMini from '@polkadot/ui-app/AddressMini';
import AddressSummary from '@polkadot/ui-app/AddressSummary';
import Button from '@polkadot/ui-app/Button';
import CopyButton from '@polkadot/ui-app/CopyButton';
import Modal from '@polkadot/ui-app/Modal';
import Notification from '@polkadot/ui-app/Notification';
import classes from '@polkadot/ui-app/util/classes';
import keyring from '@polkadot/ui-keyring/index';
import Unlock from '@polkadot/ui-signer/Unlock';

import translate from './translate';

type Props = I18nProps & BareProps & {
  address: string,
  error?: FormErrorProps,
  handleChangeAccountPassword: () => void,
  hidePasswordModal: () => void,
  isPasswordModalOpen: boolean,
  onChangePassword: (password: string) => void,
  onChangeNewPassword: (newPassword: string) => void,
  onDiscard: () => void,
  newPassword: string,
  password: string,
  success?: React.ReactNode
};

class ChangePasswordModal extends React.PureComponent<Props> {
  render () {
    const { address, className, error, hidePasswordModal, isPasswordModalOpen, style, success } = this.props;
    const { formError } = error && error.props.props;

    return (
      <Modal
        className={classes('ui--Accounts-change-password-Signer', className)}
        dimmer='inverted'
        open={isPasswordModalOpen}
        onClose={hidePasswordModal}
        size='mini'
        style={style}
      >
        <Modal.Content>
          <div className='accounts--Address-modal-wrapper ui--grid'>
            <div className='accounts--Address-modal'>
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
              <div className='accounts--Address-modal-message expanded'>
                <p>
                  <Trans i18nKey='unlock.info'>
                    Please enter your existing account password and new account password to unlock and change it.
                  </Trans>
                </p>
              </div>
              {this.renderContentPassword()}
              {this.renderContentNewPassword()}
            </div>
            {this.renderButtons()}
            <Notification
              formError={formError}
              success={success}
            />
          </div>
        </Modal.Content>
      </Modal>
    );
  }

  renderContentPassword () {
    const { address, error, onChangePassword, password, t } = this.props;

    const { inputError } = error && error.props.props;
    const passwordError = inputError && inputError.hasOwnProperty('password') ? inputError.password : undefined;

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
        tabIndex='1'
        value={keyringAddress.publicKey()}
      />
    );
  }

  renderContentNewPassword () {
    const { address, error, onChangeNewPassword, newPassword, t } = this.props;

    const { inputError } = error && error.props.props;
    const newPasswordError = inputError && inputError.hasOwnProperty('newPassword') ? inputError.newPassword : undefined;

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
        tabIndex='2'
        value={keyringAddress.publicKey()}
      />
    );
  }

  renderButtons () {
    const { error, handleChangeAccountPassword, newPassword, onDiscard, password, t } = this.props;

    const { inputError } = error && error.props.props;

    const emptyInputValues = !password || !newPassword;
    const isInputError = !!inputError.password || !!inputError.newPassword;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={onDiscard}
            tabIndex='4'
            text={t('creator.discard', {
              defaultValue: 'Cancel'
            })}
          />
          <Button.Or />
          <Button
            isDisabled={emptyInputValues || isInputError}
            isPrimary
            className='ui--Button-submit'
            onClick={handleChangeAccountPassword}
            tabIndex='3'
            text={t('creator.submit', {
              defaultValue: 'Submit'
            })}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  onKeyDown = (event: any): void => {
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
