// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Signer, SignerResult } from '@polkadot/api/types';
import { SignerPayloadJSON } from '@polkadot/types/types';

import { getLedger, registry } from '@polkadot/react-api';

let id = 0;

export default class LedgerSigner implements Signer {
  #accountOffset: number;
  #addressOffset: number;

  constructor (accountOffset: number, addressOffset: number) {
    this.#accountOffset = accountOffset;
    this.#addressOffset = addressOffset;
  }

  public async signPayload (payload: SignerPayloadJSON): Promise<SignerResult> {
    const raw = registry.createType('ExtrinsicPayload', payload, { version: payload.version });
    const { signature } = await getLedger().sign(raw.toU8a(true), this.#accountOffset, this.#addressOffset);

    return { id: ++id, signature };
  }
}
