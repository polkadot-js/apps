// Copyright 2017-2024 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Signer, SignerResult } from '@polkadot/api/types';
import type { LedgerGeneric } from '@polkadot/hw-ledger';
import type { Registry, SignerPayloadJSON } from '@polkadot/types/types';

import { hexToU8a, objectSpread, u8aToHex } from '@polkadot/util';
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
    // TODO hardcoded just for testing, will remove or fix soon!
    const { address } = await this.#getLedger().getAddress(0, false, 0, 0);
    const m = await this.#api.call.metadata.metadataAtVersion(15);
    const { specName, specVersion } = await this.#api.rpc.state.getRuntimeVersion();
    const merkleizedMetadata = merkleizeMetadata(m.toHex(), {
      base58Prefix: this.#api.consts.system.ss58Prefix.toNumber(),
      decimals: 10,
      specName: specName.toString(),
      specVersion: specVersion.toNumber(),
      tokenSymbol: 'DOT'
    });

    const metadataHash = u8aToHex(merkleizedMetadata.digest());

    const newPayload = objectSpread({}, payload, { metadataHash, mode: 1 });
    const raw = this.#registry.createType('ExtrinsicPayload', newPayload);
    const txMetadata = u8aToHex(merkleizedMetadata.getProofForExtrinsicPayload(u8aToHex(raw.toU8a(true))));
    const buff = Buffer.from(hexToU8a(txMetadata));
    const { signature } = await this.#getLedger().signWithMetadata(raw.toU8a(true), 0, this.#accountOffset, { metadata: buff });

    const extrinsic = this.#registry.createType(
      'Extrinsic',
      { method: raw.method },
      { version: 4 }
    );

    extrinsic.addSignature(address, signature, raw.toHex());

    return { id: ++id, signature, signedTransaction: extrinsic.toHex() };
  }
}
