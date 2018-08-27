// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps, I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import keyring from '@polkadot/ui-keyring/index';
import Button from '@polkadot/ui-app/Button';
import classes from '@polkadot/ui-app/util/classes';

import ChangePasswordModal from './ChangePasswordModal';
import translate from './translate';

type State = {
  address: string,
  error?: React.ReactNode,
  isPasswordModalOpen: boolean,
  password: string,
  newPassword: string,
  success?: React.ReactNode
};

type Props = I18nProps & BareProps & {
  address: string
};

class ChangePasswordButton extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.emptyState();
  }

  handleChangeAccountPassword = (): void => {
    const { t } = this.props;
    const { address, password, newPassword } = this.state;

    if (!address) {
      return;
    }

    try {
      // TODO - implement initial change password functionality, and then allow change by use of seed phrase
      const result: boolean = keyring.changeAccountPassword(address, password, newPassword);

      if (result) {
        this.setState({
          success: t('editor.change.password.success', {
            defaultValue: 'Successfully changed account password'
          })
        });
      } else {
        this.setState({
          error: t('editor.change.password.error', {
            defaultValue: 'Unable to changed account password'
          })
        });
      }
    } catch (e) {
      this.setState({
        error: t('editor.change.password.error', {
          defaultValue: 'Unable to change account password'
        })
      });
      console.error('Error retrieving account to change password: ', e);
    }

    this.setState({
      password: '',
      newPassword: ''
    });
  }

  showPasswordModal = (): void => {
    const { address } = this.props;

    this.setState({
      isPasswordModalOpen: true,
      address: address,
      password: '',
      newPassword: ''
    });
  }

  hidePasswordModal = (): void => {
    this.setState({ isPasswordModalOpen: false });
  }

  render () {
    const { address, error, isPasswordModalOpen, newPassword, password, success } = this.state;
    const { className, style, t } = this.props;

    if (!address) {
      return null;
    }

    return (
      <div
        className={classes('ui--Accounts-change-password', className)}
        style={style}
      >
        <ChangePasswordModal
          address={address}
          className={className}
          error={error}
          handleChangeAccountPassword={this.handleChangeAccountPassword}
          hidePasswordModal={this.hidePasswordModal}
          isPasswordModalOpen={isPasswordModalOpen}
          key='accounts-change-password-signer-modal'
          newPassword={newPassword}
          onChangePassword={this.onChangePassword}
          onChangeNewPassword={this.onChangeNewPassword}
          onDiscard={this.onDiscard}
          password={password}
          style={style}
          success={success}
        />
        <Button
          onClick={this.showPasswordModal}
          text={t('editor.change.password', {
            defaultValue: 'Change Password'
          })}
        />
      </div>
    );
  }

  emptyState (): State {
    const { address } = this.props;

    return {
      address: address,
      error: undefined,
      isPasswordModalOpen: false,
      newPassword: '',
      password: '',
      success: undefined
    };
  }

  onChangePassword = (password: string): void => {
    this.setState({
      error: undefined,
      password,
      success: undefined
    });
  }

  onChangeNewPassword = (newPassword: string): void => {
    this.setState({
      error: undefined,
      newPassword,
      success: undefined
    });
  }

  onDiscard = (): void => {
    this.setState(this.emptyState());
  }
}

export {
  ChangePasswordButton
};

export default translate(ChangePasswordButton);
