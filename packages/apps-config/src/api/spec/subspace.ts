import type { Observable } from "rxjs";
import type { ApiInterfaceRx } from "@polkadot/api/types";
import type { OverrideBundleDefinition, Registry } from "@polkadot/types/types";
import type { Bytes, Struct, U8aFixed, u64 } from "@polkadot/types";
import { combineLatest, map } from "rxjs";
import { memo } from "@polkadot/api-derive/util";
import { AccountId, Digest, Header } from "@polkadot/types/interfaces";
import {
  bestNumberFinalized,
  bestNumber,
  bestNumberLag,
  getBlock,
  subscribeNewBlocks,
} from "@polkadot/api-derive/chain";

interface HeaderExtended extends Header {
  readonly author: AccountId | undefined;
}

interface Solution extends Struct {
  readonly public_key: AccountId;
  readonly nonce: u64;
  readonly encoding: Bytes;
  readonly signature: Bytes;
  readonly tag: U8aFixed;
}

interface SUBPreDigest extends Struct {
  readonly slot: u64;
  readonly solution: Solution;
}

function extractAuthor(
  digest: Digest,
  api: ApiInterfaceRx
): AccountId | undefined {
  let accountId: AccountId | undefined;

  for (const log of digest.logs) {
    if (log.isPreRuntime) {
      const [type, data] = log.asPreRuntime;
      if (type.toString() === "SUB_") {
        const { solution }: SUBPreDigest = api.registry.createType(
          "SUBPreDigest",
          data
        );

        const { public_key }: Solution = api.registry.createType(
          "Solution",
          solution
        );
        accountId = public_key;
        break;
      }
    }
  }

  return accountId;
}

function createHeaderExtended(
  registry: Registry,
  header: Header,
  api: ApiInterfaceRx
): HeaderExtended {
  const HeaderBase = registry.createClass("Header");
  class PocHeaderExtended extends HeaderBase implements HeaderExtended {
    readonly #author?: AccountId;

    constructor(registry: Registry, header: Header, api: ApiInterfaceRx) {
      super(registry, header);
      this.#author = extractAuthor(this.digest, api);
      this.createdAtHash = header?.createdAtHash;
    }

    public get author(): AccountId | undefined {
      return this.#author;
    }
  }

  return new PocHeaderExtended(registry, header, api);
}

function subscribeNewHeads(
  instanceId: string,
  api: ApiInterfaceRx
): () => Observable<HeaderExtended> {
  debugger
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

function getHeader(
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
      // Validate and test if this override affect other pages.
      // for now it do not break anything.
      subscribeNewHeads,
      getHeader,
      // Had to re export the following functions. Must be a way to avoid re export for now it works
      getBlock,
      subscribeNewBlocks,
      bestNumberFinalized,
      bestNumberLag,
      bestNumber,
    }
   /* session:{ 
      // This was imposible to extend for now, session module its not available in the Runtime Config
      progress
      eraProgress
    }*/
  },
  types: [
    {
      minmax: [0, undefined],
      types: {
        Solution: {
          public_key: "AccountId",
          nonce: "u64",
          encoding: "Vec<u8>",
          signature: "Vec<u8>",
          tag: "[u8; 8]",
        },
        SUBPreDigest: {
          slot: "Slot",
          solution: "Solution",
        },
      },
    },
  ],
};

export default definitions;
