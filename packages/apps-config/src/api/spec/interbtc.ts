// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */

import type { Observable } from 'rxjs';
import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { OverrideBundleDefinition } from '@polkadot/types/types';

import interbtc from '@interlay/interbtc-types';
import { combineLatest, map } from 'rxjs';

import { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { memo } from '@polkadot/api-derive/util';
import { TypeRegistry, U128 } from '@polkadot/types';
import { Balance } from '@polkadot/types/interfaces';
import { BN, formatBalance } from '@polkadot/util';

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
    reservedBalance: balanceOf(0)
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
  const nativeToken = api.registry.chainTokens[0] || formatBalance.getDefaults().unit;

  return memo(
    instanceId,
    (account: string): Observable<DeriveBalancesAll> =>
      combineLatest<[any]>([api.query.tokens.accounts(account, { Token: nativeToken })]).pipe(
        map(([data]: [OrmlAccountData]): DeriveBalancesAll => {
          return {
            ...defaultAccountBalance(),
            accountId: api.registry.createType('AccountId', account),
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
      all: getBalance
    }
  },

  ...interbtc
} as any;

export default definitions;
