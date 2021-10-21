// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

import type { Observable } from 'rxjs';
import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { Bytes, Struct, U8aFixed, u64 } from '@polkadot/types';
import type { OverrideBundleDefinition, Registry } from '@polkadot/types/types';

import { combineLatest, map } from 'rxjs';

import { bestNumber, bestNumberFinalized, bestNumberLag, getBlock, subscribeNewBlocks } from '@polkadot/api-derive/chain';
import { memo } from '@polkadot/api-derive/util';
import { Digest, Header } from '@polkadot/types/interfaces';

type FarmerPublicKey = U8aFixed

interface HeaderExtended extends Header {
  readonly author: FarmerPublicKey | undefined;
}

interface Solution extends Struct {
  readonly publicKey: FarmerPublicKey;
  readonly nonce: u64;
  readonly encoding: Bytes;
  readonly signature: Bytes;
  readonly tag: U8aFixed;
}

interface SubPreDigest extends Struct {
  readonly slot: u64;
  readonly solution: Solution;
}

function extractAuthor (
  digest: Digest,
  api: ApiInterfaceRx
): FarmerPublicKey | undefined {
  const preRuntimes = digest.logs.filter(
    ({ isPreRuntime, type }) => isPreRuntime && type.toString() === 'SUB_'
  );
  const { solution }: SubPreDigest = api.registry.createType(
    'SubPreDigest',
    preRuntimes[0]
  );

  return solution.publicKey;
}

function createHeaderExtended (
  registry: Registry,
  header: Header,
  api: ApiInterfaceRx
): HeaderExtended {
  const HeaderBase = registry.createClass('Header');

  class SubHeaderExtended extends HeaderBase implements HeaderExtended {
    readonly #author?: FarmerPublicKey;

    constructor (registry: Registry, header: Header, api: ApiInterfaceRx) {
      super(registry, header);
      this.#author = extractAuthor(this.digest, api);
      this.createdAtHash = header?.createdAtHash;
    }

    public get author (): FarmerPublicKey | undefined {
      return this.#author;
    }
  }

  return new SubHeaderExtended(registry, header, api);
}

function subscribeNewHeads (
  instanceId: string,
  api: ApiInterfaceRx
): () => Observable<HeaderExtended> {
  return memo(
    instanceId,
    (): Observable<HeaderExtended> =>
      combineLatest([api.rpc.chain.subscribeNewHeads()]).pipe(
        map(([header]): HeaderExtended => {
          return createHeaderExtended(header.registry, header, api);
        })
      )
  );
}

function getHeader (
  instanceId: string,
  api: ApiInterfaceRx
): () => Observable<HeaderExtended> {
  return memo(
    instanceId,
    (): Observable<HeaderExtended> =>
      combineLatest([api.rpc.chain.getHeader()]).pipe(
        map(([header]): HeaderExtended => {
          return createHeaderExtended(header.registry, header, api);
        })
      )
  );
}

const definitions: OverrideBundleDefinition = {
  derives: {
    chain: {
      bestNumber,
      bestNumberFinalized,
      bestNumberLag,
      getBlock,
      getHeader,
      subscribeNewBlocks,
      subscribeNewHeads
    }
  },
  types: [
    {
      minmax: [0, undefined],
      types: {
        FarmerPublicKey: '[u8; 32]',
        Solution: {
          publicKey: 'FarmerPublicKey',
          nonce: 'u64',
          encoding: 'Vec<u8>',
          signature: 'Vec<u8>',
          tag: '[u8; 8]'
        },
        SubPreDigest: {
          slot: 'u64',
          solution: 'Solution'
        }
      }
    }
  ]
};

export default definitions;
