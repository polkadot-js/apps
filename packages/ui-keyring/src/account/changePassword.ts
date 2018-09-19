// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { TranslationFunction } from 'i18next';
import { AccountResponse, State } from '../types';

import isUndefined from '@polkadot/util/is/undefined';

import updateAccount from './update';

/* Load account keyring pair from memory using account address.
 * Verify old password by trying to decrypt the pair with password to generate the secret key in keyring memory if locked.
 * Update account password with new password when secret key is in keyring memory.
 * Remove secret key from keyring memory.
 */
export default function changeAccountPassword (state: State, t: TranslationFunction, address: string, password: string, newPassword: string): AccountResponse {
  const { keyring } = state;
  let response = {
    error: undefined
  };

  if (!address) {
    response.error = t('editor.change.password.error.missing.address', {
      defaultValue: 'Address missing'
    });

    return response;
  }

  if (!password || !newPassword) {
    response.error = t('editor.change.password.error.missing.password', {
      defaultValue: 'Existing password and new password missing'
    });

    return response;
  }

  const pair = keyring.getPair(address);

  if (isUndefined(pair)) {
    response.error = t('editor.change.password.error.invalid.address', {
      defaultValue: 'Invalid address'
    });

    return response;
  }

  try {
    pair.decodePkcs8(password);
    updateAccount(state, pair, password, newPassword);
    pair.lock();

    return response;
  } catch (error) {
    console.error('Unable to decrypt account with given password: ', error);
    response.error = t('editor.change.password.error.incorrect.password', {
      defaultValue: 'Unable to decrypt account from memory with given password due to incorrect password or corrupt account. Error: {{error}}',
      replace: {
        error
      }
    });
  }
  return response;
}
