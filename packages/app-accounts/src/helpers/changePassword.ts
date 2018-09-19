// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { TranslationFunction } from 'i18next';
import { FormErrors } from '@polkadot/ui-app/types';

const emptyPasswords = {
  password: '',
  newPassword: ''
};

const emptyErrors = () => {
  return ({
    formError: '',
    inputError: emptyPasswords
  } as FormErrors);
};

const emptyStateForModal = (showModal: boolean, address: string) => {
  return ({
    address,
    error: emptyErrors(),
    newPassword: '',
    password: '',
    showModal,
    success: undefined
  });
};

const errorForKey = (key: string, t: TranslationFunction) => {
  const errors: any = {
    'editor.change.password.input.password.differ.error': t('editor.change.password.input.password.differ.error', {
      defaultValue: 'Existing password must differ from new password'
    }),
    'editor.change.password.input.password.empty.error': t('editor.change.password.input.password.empty.error', {
      defaultValue: 'Existing password must not be empty'
    }),
    'editor.change.password.input.newPassword.empty.error': t('editor.change.password.input.newPassword.empty.error', {
      defaultValue: 'New password must not be empty'
    }),
    'editor.change.password.input.newpassword.differ.error': t('editor.change.password.input.newpassword.differ.error', {
      defaultValue: 'New password must differ from existing password'
    })
  };
  return errors[key];
};

const isEmptyPassword = (password: string) => password.length === 0;

const isSamePassword = (password: string, newPassword: string) => password === newPassword;

export {
  emptyErrors,
  emptyPasswords,
  emptyStateForModal,
  errorForKey,
  isEmptyPassword,
  isSamePassword
};
