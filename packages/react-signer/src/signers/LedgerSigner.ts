// Copyright 2017-2024 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Signer, SignerResult } from '@polkadot/api/types';
import type { LedgerGeneric } from '@polkadot/hw-ledger';
import type { Registry, SignerPayloadJSON } from '@polkadot/types/types';

import { objectSpread } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto'
import { init, RuntimeMetadata } from 'merkleized-metadata';

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
    const mm = await init();
    const m = await this.#api.call.metadata.metadataAtVersion(15);
    const { specName, specVersion } = await this.#api.rpc.state.getRuntimeVersion();
    const runtimeMetadata = RuntimeMetadata.fromHex(m.toHex());
    const digest = mm.generateMetadataDigest(runtimeMetadata, {
        base58Prefix: this.#api.consts.system.ss58Prefix.toNumber(),
        decimals: 10,
        specName: specName.toString(),
        specVersion: specVersion.toNumber(),
        tokenSymbol: 'DOT'
    });

    const newPayload = objectSpread({}, payload, { mode: 1, metadataHash: '0x' + digest.hash() });
    const raw = this.#registry.createType('ExtrinsicPayload', newPayload);
    const { signature } = await this.#getLedger().sign(raw.toU8a(true), 0, this.#accountOffset);

    const extrinsic = this.#registry.createType(
      'Extrinsic',
      { method: raw.method },
      { version: 4 }
    );

    console.log(address);
    extrinsic.addSignature(address, signature, raw.toHex())

    console.log('verify: ', signatureVerify(extrinsic.toHex(), signature, address))

    return { id: ++id, signature, signedTransaction: extrinsic.toHex() };
  }
}
