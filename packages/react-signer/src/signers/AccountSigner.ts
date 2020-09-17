// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Signer, SignerResult } from '@polkadot/api/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { SignerPayloadJSON } from '@polkadot/types/types';

import { registry } from '@polkadot/react-api';

let id = 0;

export default class AccountSigner implements Signer {
  readonly #keyringPair: KeyringPair;

  constructor (keyringPair: KeyringPair) {
    this.#keyringPair = keyringPair;
  }

  public async signPayload (payload: SignerPayloadJSON): Promise<SignerResult> {
    return new Promise((resolve): void => {
      const signed = registry.createType('ExtrinsicPayload', payload, { version: payload.version }).sign(this.#keyringPair);

      resolve({ id: ++id, ...signed });
    });
  }
}
