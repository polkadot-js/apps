// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { TranslationFunction } from 'i18next';
import { KeyringPair, KeyringPair$Json } from '@polkadot/util-keyring/types';
import { AccountResponse, State } from '../types';

// Load account keyring pair into memory using account JSON file.
export default function accountLoad (state: State, t: TranslationFunction, json: KeyringPair$Json): AccountResponse {
  const { keyring } = state;
  const address = json.address;
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

  try {
    response.pair = keyring.addFromJson(json);

    return response;
  } catch (error) {
    console.error('Unable to load account from memory', error);
    response.error = t('restore.error.incorrect.json', {
      defaultValue: 'Unable to load account with JSON file'
    });
  }
  return response;
}
