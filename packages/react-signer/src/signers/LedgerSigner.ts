// Copyright 2017-2025 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

// This is for the use of `Ledger`
//
/* eslint-disable deprecation/deprecation */

import type { ApiPromise } from '@polkadot/api';
import type { Signer, SignerResult } from '@polkadot/api/types';
import type { Ledger, LedgerGeneric } from '@polkadot/hw-ledger';
import type { Registry, SignerPayloadJSON } from '@polkadot/types/types';

import { settings } from '@polkadot/ui-settings';
import { objectSpread, u8aToHex } from '@polkadot/util';
import { merkleizeMetadata } from '@polkadot-api/merkleize-metadata';

let id = 0;

export class LedgerSigner implements Signer {
  readonly #accountIndex: number;
  readonly #addressOffset: number;
  readonly #getLedger: () => LedgerGeneric | Ledger;
  readonly #registry: Registry;
  readonly #api: ApiPromise;

  constructor (api: ApiPromise, getLedger: () => LedgerGeneric | Ledger, accountIndex: number, addressOffset: number) {
    this.#accountIndex = accountIndex;
    this.#addressOffset = addressOffset;
    this.#getLedger = getLedger;
    this.#registry = api.registry;
    this.#api = api;
  }

  private async getMetadataProof (payload: SignerPayloadJSON) {
    const m = await this.#api.call.metadata.metadataAtVersion(15);
    const { specName, specVersion } = this.#api.runtimeVersion;
    const merkleizedMetadata = merkleizeMetadata(m.toHex(), {
      base58Prefix: this.#api.consts.system.ss58Prefix.toNumber(),
      decimals: this.#api.registry.chainDecimals[0],
      specName: specName.toString(),
      specVersion: specVersion.toNumber(),
      tokenSymbol: this.#api.registry.chainTokens[0]
    });
    const metadataHash = u8aToHex(merkleizedMetadata.digest());
    const newPayload = objectSpread({}, payload, { metadataHash, mode: 1 });
    const raw = this.#registry.createType('ExtrinsicPayload', newPayload);

    return {
      raw,
      txMetadata: merkleizedMetadata.getProofForExtrinsicPayload(u8aToHex(raw.toU8a(true)))
    };
  }

  public async signPayload (payload: SignerPayloadJSON): Promise<SignerResult> {
    const currApp = settings.get().ledgerApp;

    if (currApp === 'migration' || currApp === 'generic') {
      const { address } = await (this.#getLedger() as LedgerGeneric).getAddress(
        this.#api.consts.system.ss58Prefix.toNumber(),
        false,
        this.#accountIndex,
        this.#addressOffset
      );
      const { raw, txMetadata } = await this.getMetadataProof(payload);

      const buff = Buffer.from(txMetadata);
      const { signature } = await (this.#getLedger() as LedgerGeneric).signWithMetadata(raw.toU8a(true), this.#accountIndex, this.#addressOffset, { metadata: buff });

      const extrinsic = this.#registry.createType(
        'Extrinsic',
        { method: raw.method },
        { version: 4 }
      );

      extrinsic.addSignature(address, signature, raw.toHex());

      return { id: ++id, signature, signedTransaction: extrinsic.toHex() };
    } else {
      // This is when the option is `chainSpecific`
      const raw = this.#registry.createType('ExtrinsicPayload', payload, { version: payload.version });
      const { signature } = await this.#getLedger().sign(raw.toU8a(true), this.#accountIndex, this.#addressOffset);

      return { id: ++id, signature };
    }
  }
}
