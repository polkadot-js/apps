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
import { AccountId, Digest, Header } from '@polkadot/types/interfaces';

interface HeaderExtended extends Header {
  readonly author: AccountId | undefined;
}

interface Solution extends Struct {
  readonly publicKey: AccountId;
  readonly nonce: u64;
  readonly encoding: Bytes;
  readonly signature: Bytes;
  readonly tag: U8aFixed;
}

interface SUBPreDigest extends Struct {
  readonly slot: u64;
  readonly solution: Solution;
}

function extractAuthor (
  digest: Digest,
  api: ApiInterfaceRx
): AccountId | undefined {
  const preRuntimes = digest.logs.filter(
    ({ isPreRuntime, type }) => isPreRuntime && type.toString() === 'SUB_'
  );
  const { solution }: SUBPreDigest = api.registry.createType(
    'SUBPreDigest',
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

  class SUBHeaderExtended extends HeaderBase implements HeaderExtended {
    readonly #author?: AccountId;

    constructor (registry: Registry, header: Header, api: ApiInterfaceRx) {
      super(registry, header);
      this.#author = extractAuthor(this.digest, api);
      this.createdAtHash = header?.createdAtHash;
    }

    public get author (): AccountId | undefined {
      return this.#author;
    }
  }

  return new SUBHeaderExtended(registry, header, api);
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
        Solution: {
          publicKey: 'AccountId',
          nonce: 'u64',
          encoding: 'Vec<u8>',
          signature: 'Vec<u8>',
          tag: '[u8; 8]'
        },
        SUBPreDigest: {
          slot: 'u64',
          solution: 'Solution'
        }
      }
    }
  ]
};

export default definitions;
