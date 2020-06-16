// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Signer, SignerResult } from '@polkadot/api/types';
import { SubmittableResult } from '@polkadot/api';
import { Hash } from '@polkadot/types/interfaces';
import { SignerPayloadJSON } from '@polkadot/types/types';

import { assert } from '@polkadot/util';

export default class ProxySigner implements Signer {
  readonly #completeCb: () => void;

  readonly #signer: Signer;

  constructor (signer: Signer | undefined, completeCb: () => void) {
    assert(signer, 'No signer specified');

    this.#completeCb = completeCb;
    this.#signer = signer;
  }

  public async signPayload (payload: SignerPayloadJSON): Promise<SignerResult> {
    assert(this.#signer.signPayload, 'Signer has no payload capabilities');

    const result = await this.#signer.signPayload(payload);

    this.#completeCb();

    return new Promise((resolve): void => {
      setTimeout(() => resolve(result), 1);
    });
  }

  public update (id: number, result: Hash | SubmittableResult): void {
    this.#signer.update && this.#signer.update(id, result);
  }
}
