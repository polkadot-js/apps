// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps, FormErrorProps, I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import classes from '@polkadot/ui-app/util/classes';
import Button from '@polkadot/ui-app/Button';
import Error from '@polkadot/ui-app/Error';
import keyring from '@polkadot/ui-keyring/index';

import ChangePasswordModal from './ChangePasswordModal';
import translate from './translate';

type State = {
  address: string,
  error?: FormErrorProps,
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
    let newError;
    let newErrorProps = error && error.props.props || this.emptyErrorProps();
    const isInputError = newErrorProps.inputError.password || newErrorProps.inputError.newPassword;

    /* Prevent form submission if any input fields invalid, even though
     * should not be possible since submit button disabled when input error exists
     */
    if (isInputError) {
      newErrorProps.formError = t('editor.change.password.form.error', {
        defaultValue: 'Unable to submit form due to input error(s)'
      });

      newError = <Error props={newErrorProps} />;

      this.setState({
        error: newError
      });

      return;
    } else {
      newErrorProps.formError = t('editor.change.password.form.error', {
        defaultValue: 'Unable to changed account password'
      });

      newError = <Error props={newErrorProps} />;
    }

    if (!address) {
      return;
    }

    try {
      const result: boolean = keyring.changeAccountPassword(address, password, newPassword);
      const emptyError = <Error props={this.emptyErrorProps()}/>;

      if (result) {
        this.setState({
          error: emptyError, // reset input and form errors
          success: t('editor.change.password.success', {
            defaultValue: 'Successfully changed account password'
          })
        });
      } else {
        this.setState({
          error: newError
        });
      }
    } catch (error) {
      this.setState({
        error: newError
      });

      console.error('Error retrieving account to change password: ', error);
    }

    this.resetPasswordInputs();
  }

  showPasswordModal = (): void => {
    const { address } = this.props;

    this.setState({
      address,
      isPasswordModalOpen: true
    });

    this.resetPasswordInputs();
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
    const emptyError = <Error props={this.emptyErrorProps()} />;

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

    let newError = error;
    let newErrorProps = error && error.props.props || this.emptyErrorProps();

    if (this.isSamePassword(password, newPassword)) {
      newErrorProps.inputError.password = t('editor.change.password.input.password.differ.error', {
        defaultValue: 'Existing password must differ from new password'
      });
    } else if (this.isEmptyPassword(password)) {
      newErrorProps.inputError.password = t('editor.change.password.input.password.empty.error', {
        defaultValue: 'Existing password must not be empty'
      });
    } else {
      newErrorProps.formError = '';
      newErrorProps.inputError.password = '';
    }

    newError = <Error props={newErrorProps} />;

    this.setState({
      error: newError,
      password,
      success: undefined
    });
  }

  onChangeNewPassword = (newPassword: string): void => {
    const { t } = this.props;
    const { error, password } = this.state;

    let newError = error;
    let newErrorProps = error && error.props.props || this.emptyErrorProps();

    if (this.isSamePassword(password, newPassword)) {
      newErrorProps.inputError.newPassword = t('editor.change.password.input.newpassword.differ.error', {
        defaultValue: 'New password must differ from existing password'
      });
    } else if (this.isEmptyPassword(newPassword)) {
      newErrorProps.inputError.newPassword = t('editor.change.password.input.newPassword.empty.error', {
        defaultValue: 'New password must not be empty'
      });
    } else {
      newErrorProps.formError = '';
      newErrorProps.inputError.newPassword = '';
    }

    newError = <Error props={newErrorProps} />;

    this.setState({
      error: newError,
      newPassword,
      success: undefined
    });
  }

  onDiscard = (): void => {
    this.setState(this.emptyState());
  }

  emptyErrorProps = () => {
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

  resetPasswordInputs = (): void => {
    this.setState({
      newPassword: '',
      password: ''
    });
  }
}

export {
  ChangePasswordButton
};

export default translate(ChangePasswordButton);
