// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { TranslationFunction } from 'i18next';
import { AccountResponse, State } from '../types';

import updateAccount from './update';

export default function changeAccountPassword (state: State, t: TranslationFunction, address: string, password: string, newPassword: string): AccountResponse {
  const { keyring } = state;
  let response = { error: undefined };

  if (!address || !password || !newPassword) {
    response.error = t('editor.change.password.error.missing.address.password', {
      defaultValue: 'Missing existing password, new password, or address'
    });

    return response;
  }

  try {
    const pair = keyring.getPair(address);
    pair.decodePkcs8(password);
    updateAccount(state, pair, password, newPassword);
    pair.lock();

    return response;
  } catch (error) {
    response.error = t('editor.change.password.error.incorrect.address.password', {
      defaultValue: `${error}`
    });
  }
  return response;
}
