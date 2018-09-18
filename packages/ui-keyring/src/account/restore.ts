// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { TranslationFunction } from 'i18next';
import { KeyringPair, KeyringPair$Json } from '@polkadot/util-keyring/types';
import { AccountResponse, State } from '../types';

import store from 'store';
import isUndefined from '@polkadot/util/is/undefined';

import { accountKey } from '../defaults';
import createOptions from '../options';
import accountLoad from './load';

/* Load account keyring pair into memory using account JSON file.
 * Decrypt the pair with password to generate the secret key in keyring memory (whether locked or not).
 * Remove secret key from keyring memory.
 */
export default function accountRestore (state: State, t: TranslationFunction, json: KeyringPair$Json, password?: string): AccountResponse {
  const address = json.address;
  const { pair, error } = accountLoad(state, t, json);
  let response = {
    pair: {} as KeyringPair,
    error: undefined
  };

  if (!address) {
    response.error = t('restore.error.missing.address', {
      defaultValue: 'Unable to load account address from JSON file. Address missing'
    });

    return response;
  }

  if (!isUndefined(error) || isUndefined(pair)) {
    response.error = error || t('restore.error.unknown', {
      defaultValue: 'Unable to load account address from JSON file. Unknown error'
    });

    return response;
  }

  try {
    if (pair) {
      pair.decodePkcs8(password);
      store.set(accountKey(address), json);
      state.accounts.add(address, json);
      createOptions(state);
      pair.lock();
      response.pair = pair;

      return response;
    }
  } catch (error) {
    if (error.message === 'Unable to unencrypt using the supplied passphrase') {
      response.error = t('restore.error.incorrect.password', {
        defaultValue: 'Unable to decrypt account from memory with given password due to incorrect password or corrupt JSON file. Error: {{error}}',
        replace: {
          error
        }
      });
      console.error('Unable to restore account when invalid password provided', error);
    } else if (error.message === 'Invalid Pkcs8 header found in body') {
      response.error = t('restore.error.missing.password', {
        defaultValue: 'Unable to decrypt account from memory when no password provided. Error: {{error}}',
        replace: {
          error
        }
      });
      console.error('Unable to restore account when no password provided', error);
    } else {
      response.error = t('restore.error.corrupt', {
        defaultValue: 'Unable to decrypt account from memory when account corrupt. Error: {{error}}',
        replace: {
          error
        }
      });
      console.error('Unable to restore account when account corrupt', error);
    }
  }
  return response;
}
