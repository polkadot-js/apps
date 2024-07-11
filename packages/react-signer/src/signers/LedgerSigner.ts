// Copyright 2017-2024 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Signer, SignerResult } from '@polkadot/api/types';
import type { LedgerGeneric } from '@polkadot/hw-ledger';
import type { Registry, SignerPayloadJSON } from '@polkadot/types/types';

import { u8aToBuffer } from '@polkadot/util';
import { merkleizeMetadata } from '@polkadot-api/merkleize-metadata';

let id = 0;

export class LedgerSigner implements Signer {
  readonly #accountOffset: number;
  readonly #getLedger: () => LedgerGeneric;
  readonly #registry: Registry;
  readonly #api: ApiPromise;

  constructor (api: ApiPromise, getLedger: () => LedgerGeneric, accountOffset: number) {
    this.#accountOffset = accountOffset;
    this.#getLedger = getLedger;
    this.#registry = api.registry;
    this.#api = api;
  }

  public async signPayload (payload: SignerPayloadJSON): Promise<SignerResult> {
    const m = await this.#api.call.metadata.metadataAtVersion(15);
    const merkleizedMetadata = merkleizeMetadata(m.unwrap().toU8a(), {
      base58Prefix: 0,
      decimals: 10,
      specName: 'polkadot',
      specVersion: 1_002_006,
      tokenSymbol: 'DOT'
    });
    const hash = merkleizedMetadata.digest();
    const raw = this.#registry.createType('ExtrinsicPayload', payload, { version: payload.version });
    const { signature } = await this.#getLedger().signWithMetadata(raw.toU8a(true), this.#accountOffset, { metadata: u8aToBuffer(hash) });

    return { id: ++id, signature };
  }
}
