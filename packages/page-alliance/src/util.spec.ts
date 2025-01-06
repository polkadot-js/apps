// Copyright 2017-2025 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

import { Metadata, TypeRegistry } from '@polkadot/types';
import substrate from '@polkadot/types-support/metadata/static-substrate';

import { createCid, createPalletCid } from './util.js';

const registry = new TypeRegistry();
const metadata = new Metadata(registry, substrate);

registry.setMetadata(metadata);

describe('util', (): void => {
  describe('createPalletCid', (): void => {
    it('encodes an ipfs hash to a pallet CID', (): void => {
      expect(
        createPalletCid(registry, 'QmTx8GZrQGwQ1ZLquZ4yPqSukDdkvKwpYCULsfLo6G47TX')?.toHuman()
      ).toEqual({
        codec: 0x70.toString(),
        hash_: {
          code: 0x12.toString(),
          digest: '0x5360ecbd380c10f43bc0a6aba27556580011a5e833592df8dcf330c94759e862'
        },
        version: 'V0'
      });
    });
  });

  describe('createIpfsHash', (): void => {
    it('encodes a pallet CID into an ipfs hash', (): void => {
      const cid = registry.createType('PalletAllianceCid', {
        codec: 0x70,
        hash_: {
          code: 0x12,
          digest: '0x5360ecbd380c10f43bc0a6aba27556580011a5e833592df8dcf330c94759e862'
        },
        version: 'V0'
      });

      expect(
        createCid(cid).ipfs
      ).toEqual('QmTx8GZrQGwQ1ZLquZ4yPqSukDdkvKwpYCULsfLo6G47TX');
    });
  });
});
