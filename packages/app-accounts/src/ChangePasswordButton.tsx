// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps, FormErrors, I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import classes from '@polkadot/ui-app/util/classes';
import Button from '@polkadot/ui-app/Button';
import keyring from '@polkadot/ui-keyring/index';
import isUndefined from '@polkadot/util/is/undefined';

import ChangePasswordModal from './ChangePasswordModal';
import translate from './translate';

type State = {
  address: string,
  error: FormErrors,
  isPasswordModalOpen: boolean,
  newPassword: string,
  password: string,
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
    const { address, error, newPassword, password } = this.state;
    let newError = error || this.emptyErrors();
    const isInputError = newError.inputError.password || newError.inputError.newPassword;

    /* Prevent form submission if any input fields invalid, even though
     * should not be possible since submit button disabled when input error exists
     */
    if (isInputError) {
      newError.formError = t('editor.change.password.form.error', {
        defaultValue: 'Unable to submit form due to input error(s)'
      });

      this.setState({ error: newError });

      return;
    } else {
      newError.formError = t('editor.change.password.form.error', {
        defaultValue: 'Unable to changed account password'
      });
    }

    if (!address) {
      return;
    }

    try {
      const { error } = keyring.changeAccountPassword(t, address, password, newPassword);
      const emptyError = this.emptyErrors();

      if (isUndefined(error)) {
        this.setState({
          error: emptyError, // reset input and form errors
          success: t('editor.change.password.success', {
            defaultValue: 'Successfully changed account password'
          })
        });
      } else {
        newError.formError = error;
        this.setState({ error: newError });
      }
    } catch (e) {
      newError.formError = t('editor.change.password.error.catch', {
        defaultValue: 'Unable to change account password due to error: {{error}}',
        replace: {
          error: e
        }
      });

      this.setState({
        error: newError
      });
      console.error('Error changing password: ', e);
    }

    this.setState({
      newPassword: '',
      password: ''
    });
  }

  showPasswordModal = (): void => {
    const { address } = this.props;
    const emptyError = this.emptyErrors();

    this.setState({
      address,
      error: emptyError,
      isPasswordModalOpen: true,
      newPassword: '',
      password: '',
      success: undefined
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
        className={classes('accounts--ChangePassword', className)}
        style={style}
      >
        <ChangePasswordModal
          address={address}
          className={className}
          error={error}
          handleChangeAccountPassword={this.handleChangeAccountPassword}
          hidePasswordModal={this.hidePasswordModal}
          isPasswordModalOpen={isPasswordModalOpen}
          key='accounts-change-password-modal'
          newPassword={newPassword}
          onChangeNewPassword={this.onChangeNewPassword}
          onChangePassword={this.onChangePassword}
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
    const emptyError = this.emptyErrors();

    return {
      address,
      error: emptyError,
      isPasswordModalOpen: false,
      newPassword: '',
      password: '',
      success: undefined
    };
  }

  onChangePassword = (password: string): void => {
    const { t } = this.props;
    const { error, newPassword } = this.state;
    let newError = error || this.emptyErrors();
    let shouldResetExistingPassword = true;

    if (this.isEmptyPassword(password)) {
      newError.inputError.password = t('editor.change.password.input.password.empty.error', {
        defaultValue: 'Existing password must not be empty'
      });
      shouldResetExistingPassword = false;
    } else if (this.isSamePassword(password, newPassword)) {
      newError.inputError.password = t('editor.change.password.input.password.differ.error', {
        defaultValue: 'Existing password must differ from new password'
      });
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

  onChangeNewPassword = (newPassword: string): void => {
    const { t } = this.props;
    const { error, password } = this.state;
    let newError = error || this.emptyErrors();
    let shouldResetNewPassword = true;

    if (this.isEmptyPassword(newPassword)) {
      newError.inputError.newPassword = t('editor.change.password.input.newPassword.empty.error', {
        defaultValue: 'New password must not be empty'
      });
      shouldResetNewPassword = false;
    } else if (this.isSamePassword(password, newPassword)) {
      newError.inputError.newPassword = t('editor.change.password.input.newpassword.differ.error', {
        defaultValue: 'New password must differ from existing password'
      });
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

  onDiscard = (): void => {
    this.setState(this.emptyState());
  }

  emptyErrors = () => {
    return (
      {
        formError: '',
        inputError: {
          password: '',
          newPassword: ''
        }
      }
    );
  }

  isEmptyPassword = (password: string) => {
    return password.length === 0;
  }

  isSamePassword = (password: string, newPassword: string) => {
    return password === newPassword;
  }
}

export {
  ChangePasswordButton
};

export default translate(ChangePasswordButton);
