// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Observable } from 'rxjs';
import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { OverrideBundleDefinition } from '@polkadot/types/types';

import { combineLatest, map } from 'rxjs';

import { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { memo } from '@polkadot/api-derive/util';
import { TypeRegistry, U128 } from '@polkadot/types';
import { Balance } from '@polkadot/types/interfaces';
import { FrameSystemAccountInfo } from '@polkadot/types/lookup';
import { BN } from '@polkadot/util';

function balanceOf (number: number | string): U128 {
  return new U128(new TypeRegistry(), number);
}

function defaultAccountBalance (): DeriveBalancesAll {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    accountNonce: new BN(1),
    additional: [],
    availableBalance: balanceOf(0),
    freeBalance: balanceOf(0),
    lockedBalance: balanceOf(0),
    lockedBreakdown: [],
    namedReserves: [],
    reservedBalance: balanceOf(0),
    vestingLocked: balanceOf(0)
  } as any;
}

interface OrmlAccountData {
  free: Balance,
  reserved: Balance,
  frozen: Balance,
}

export function getBalance (
  instanceId: string,
  api: ApiInterfaceRx
): () => Observable<DeriveBalancesAll> {
  return memo(
    instanceId,
    (account: string): Observable<DeriveBalancesAll> =>
      combineLatest<[any, any]>([api.query.tokens.accounts(account, 0), api.query.system.account(account)]).pipe(
        map(([data, systemAccount]: [OrmlAccountData, FrameSystemAccountInfo]): DeriveBalancesAll => {
          return {
            ...defaultAccountBalance(),
            accountId: api.registry.createType('AccountId', account),
            accountNonce: systemAccount.nonce,
            availableBalance: api.registry.createType('Balance', data.free.sub(data.frozen)),
            freeBalance: data.free,
            lockedBalance: data.frozen,
            reservedBalance: data.reserved
          };
        })
      )
  );
}

const definitions: OverrideBundleDefinition = {
  derives: {
    balances: {
      account: getBalance,
      all: getBalance
    }
  },
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
        Header: {
          count: 'BlockNumber',
          digest: 'Digest',
          extrinsicsRoot: 'Hash',
          number: 'Compact<BlockNumber>',
          parentHash: 'Hash',
          seed: 'ShufflingSeed',
          stateRoot: 'Hash'
        },
        ShufflingSeed: {
          proof: 'H512',
          seed: 'H256'
        }
      }
    }
  ]
};

export default definitions;
