// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps, I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import keyring from '@polkadot/ui-keyring/index';
import Button from '@polkadot/ui-app/Button';
import Error from '@polkadot/ui-app/Error';
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
    const { address, error, error: { props: { props: { inputError } } }, password, newPassword } = this.state;

    let newErrorProps: React.Props<Object> = error.props;
    let newErrorComp: React.ReactNode = undefined;

    // prevent form submission if any input fields invalid
    if (inputError.password || inputError.newPassword) {
      newErrorComp = (
        <Error
          props={
            Object.assign({
              formError: t('editor.change.password.form.error', {
                defaultValue: 'Unable to submit form due to input error(s)'
              }),
              inputError
            }, newErrorProps)
          }
        />
      );

      this.setState({
        error: newErrorComp
      });

      return;
    }

    newErrorComp = (
      <Error
        props={
          Object.assign({
            formError: t('editor.change.password.form.error', {
              defaultValue: 'Unable to changed account password'
            }),
            inputError
          }, newErrorProps)
        }
      />
    );

    if (!address) {
      return;
    }

    try {
      // TODO - implement initial change password functionality, and then allow change by use of seed phrase
      const result: boolean = keyring.changeAccountPassword(address, password, newPassword);

      // TODO - remove since is duplicate
      const emptyErrorComp: React.ReactNode = (
        <Error 
          props={
          {
            inputError: {
              password: '',
              newPassword: ''
            },
            formError: ''
          }
          }
        />
      );

      if (result) {
        this.setState({
          error: emptyErrorComp, // reset input and form errors
          success: t('editor.change.password.success', {
            defaultValue: 'Successfully changed account password'
          })
        });
      } else {
        this.setState({
          error: newErrorComp
        });
      }
    } catch (e) {
      this.setState({
        error: newErrorComp
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

    const emptyErrorComp: React.ReactNode = (
      <Error 
        props={
        {
          inputError: {
            password: '',
            newPassword: ''
          },
          formError: ''
        }
        }
      />
    );

    return {
      address: address,
      error: emptyErrorComp,
      isPasswordModalOpen: false,
      newPassword: '',
      password: '',
      success: undefined
    };
  }

  onChangePassword = (password: string): void => {
    const { t } = this.props;
    const { error, newPassword } = this.state;

    let newErrorComp: React.ReactNode = error;
    let newErrorProps = error.props.props;

    if (password === newPassword) {
      newErrorProps.inputError.password = t('editor.change.password.input.password.differ.error', {
        defaultValue: 'Existing password must differ from new password'
      });
    } else if (password.length === 0) {
      newErrorProps.inputError.password = t('editor.change.password.input.password.empty.error', {
        defaultValue: 'Existing password must not be empty'
      });
    } else {
      newErrorProps.inputError.password = '';
    }

    newErrorComp = <Error props={newErrorProps} />;

    this.setState({
      error: newErrorComp,
      password,
      success: undefined
    });
  }

  onChangeNewPassword = (newPassword: string): void => {
    const { t } = this.props;
    const { error, password } = this.state;

    let newErrorComp: React.ReactNode = error;
    let newErrorProps = error.props.props;

    if (password === newPassword) {
      newErrorProps.inputError.newPassword = t('editor.change.password.input.newpassword.differ.error', {
        defaultValue: 'New password must differ from existing password'
      });
    } else if (password.length === 0) {
      newErrorProps.inputError.newPassword = t('editor.change.password.input.newPassword.empty.error', {
        defaultValue: 'New password must not be empty'
      });
    } else {
      newErrorProps.inputError.newPassword = '';
    }

    newErrorComp = <Error props={newErrorProps} />;

    this.setState({
      error: newErrorComp,
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
