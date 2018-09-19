// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps, FormErrors, I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import classes from '@polkadot/ui-app/util/classes';
import Button from '@polkadot/ui-app/Button';
import keyring from '@polkadot/ui-keyring/index';
import isUndefined from '@polkadot/util/is/undefined';

import { emptyErrors, emptyPasswords, emptyStateForModal, errorForKey, isEmptyPassword, isSamePassword } from './helpers/changePassword';
import ChangePasswordModal from './ChangePasswordModal';
import translate from './translate';

type State = {
  address: string,
  error: FormErrors,
  newPassword: string,
  password: string,
  showModal: boolean,
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

  private handleChangeAccountPassword = (): void => {
    const { t } = this.props;
    const { address, error: stateError, newPassword, password } = this.state;
    let newError = stateError || emptyErrors();

    try {
      const { error: keyringError } = keyring.changeAccountPassword(t, address, password, newPassword);

      if (isUndefined(keyringError)) {
        this.setState({
          error: emptyErrors(),
          success: t('editor.change.password.success', {
            defaultValue: 'Success changing password'
          })
        });
      } else {
        newError.formError = keyringError;
        this.setState({ error: newError });
      }
    } catch (error) {
      newError.formError = t('editor.change.password.error.catch', {
        defaultValue: `${error}`
      });

      this.setState({ error: newError });
    }
    this.setState(emptyPasswords);
  }

  render () {
    const { address } = this.state;
    const { className, style, t } = this.props;

    if (!address) {
      return null;
    }

    return (
      <div
        className={classes('accounts--ChangePassword', className)}
        style={style}
      >
        <ChangePasswordModal
          {...this.props}
          {...this.state}
          handleChangeAccountPassword={this.handleChangeAccountPassword}
          key='accounts-change-password-modal'
          onChangeNewPassword={this.onChangeNewPassword}
          onChangePassword={this.onChangePassword}
          onDiscard={this.onDiscard}
          onHideModal={this.onHideModal}
        />
        <Button
          onClick={this.onShowModal}
          text={t('editor.change.password', {
            defaultValue: 'Change Password'
          })}
        />
      </div>
    );
  }

  private emptyState (): State {
    return emptyStateForModal(false, this.props.address);
  }

  private onChangePassword = (password: string): void => {
    const { t } = this.props;
    const { error, newPassword } = this.state;
    let newError = error || emptyErrors();
    let shouldResetExistingPassword = true;

    if (isEmptyPassword(password)) {
      newError.inputError.password = errorForKey('editor.change.password.input.password.empty.error', t);
      shouldResetExistingPassword = false;
    } else if (isSamePassword(password, newPassword)) {
      newError.inputError.password = errorForKey('editor.change.password.input.password.differ.error', t);
      shouldResetExistingPassword = false;
    }

    newError.formError = '';
    newError.inputError.newPassword = '';

    if (shouldResetExistingPassword) {
      newError.inputError.password = '';
    }

    this.setState({
      error: newError,
      password,
      success: undefined
    });
  }

  private onChangeNewPassword = (newPassword: string): void => {
    const { t } = this.props;
    const { error, password } = this.state;
    let newError = error || emptyErrors();
    let shouldResetNewPassword = true;

    if (isEmptyPassword(newPassword)) {
      newError.inputError.newPassword = errorForKey('editor.change.password.input.newPassword.empty.error', t);
      shouldResetNewPassword = false;
    } else if (isSamePassword(password, newPassword)) {
      newError.inputError.newPassword = errorForKey('editor.change.password.input.newpassword.differ.error', t);
      shouldResetNewPassword = false;
    }

    newError.formError = '';
    newError.inputError.password = '';

    if (shouldResetNewPassword) {
      newError.inputError.newPassword = '';
    }

    this.setState({
      error: newError,
      newPassword,
      success: undefined
    });
  }

  private onDiscard = (): void => {
    this.setState(this.emptyState());
  }

  private onHideModal = (): void => {
    this.setState({ showModal: false });
  }

  private onShowModal = (): void => {
    this.setState(emptyStateForModal(true, this.props.address));
  }
}

export {
  ChangePasswordButton
};

export default translate(ChangePasswordButton);
