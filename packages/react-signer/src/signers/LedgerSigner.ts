// Copyright 2017-2024 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Signer, SignerResult } from '@polkadot/api/types';
import type { LedgerGeneric } from '@polkadot/hw-ledger';
import type { Registry, SignerPayloadJSON } from '@polkadot/types/types';

import { hexToU8a } from '@polkadot/util';

let id = 0;

export class LedgerSigner implements Signer {
  readonly #accountOffset: number;
  readonly #getLedger: () => LedgerGeneric;
  readonly #registry: Registry;

  constructor (registry: Registry, getLedger: () => LedgerGeneric, accountOffset: number) {
    this.#accountOffset = accountOffset;
    this.#getLedger = getLedger;
    this.#registry = registry;
  }

  public async signPayload (payload: SignerPayloadJSON): Promise<SignerResult> {
    const raw = this.#registry.createType('ExtrinsicPayload', payload, { version: payload.version });
    const { signature } = await this.#getLedger().signWithMetadata(raw.toU8a(true), this.#accountOffset, { metadata: Buffer.from(hexToU8a(this.#registry.metadata.toHex())) });

    return { id: ++id, signature };
  }
}
