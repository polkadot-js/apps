// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { TranslationFunction } from 'i18next';
import { KeyringPair$Json } from '@polkadot/util-keyring/types';
import { AccountResponse, State } from '../types';

/* Load account keyring pair from memory using account address.
 * Decrypt the pair with password to generate the secret key in keyring memory if locked.
 * Obtain account JSON using password when secret key is in keyring memory.
 * Remove secret key from keyring memory.
 */
export default function accountBackup (state: State, t: TranslationFunction, address: string, password: string): AccountResponse {
  const { keyring } = state;
  let response = {
    json: {} as KeyringPair$Json,
    error: undefined
  };

  if (!address) {
    response.error = t('backup.error.missing.address', {
      defaultValue: 'Unable to load account from memory. Address missing'
    });
  }

  if (!password) {
    response.error = t('backup.error.missing.password', {
      defaultValue: 'Unable to load account from memory. Password missing'
    });
  }

  const pair = keyring.getPair(address);

  if (!pair) {
    response.error = t('backup.error.incorrect.address', {
      defaultValue: 'Unable to load account from memory. Incorrect address'
    });
  }

  try {
    pair.decodePkcs8(password);
    response.json = keyring.toJson(address, password);
    pair.lock();

    return response;
  } catch (error) {
    if (error.message === 'Unable to unencrypt using the supplied passphrase') {
      response.error = t('backup.error.incorrect.password', {
        defaultValue: 'Unable to decrypt account from memory with given password due to incorrect password or corrupt JSON file. Error: {{error}}',
        replace: {
          error
        }
      });
      console.error('Unable to backup account when invalid password provided', error);
    } else if (error.message === 'Invalid Pkcs8 header found in body') {
      response.error = t('backup.error.missing.password', {
        defaultValue: 'Unable to decrypt account from memory when no password provided. Error: {{error}}',
        replace: {
          error
        }
      });
      console.error('Unable to backup account when no password provided', error);
    } else {
      response.error = t('backup.error.corrupt', {
        defaultValue: 'Unable to decrypt account from memory when account corrupt. Error: {{error}}',
        replace: {
          error
        }
      });
      console.error('Unable to backup account when account corrupt', error);
    }

  }
  return response;
}
