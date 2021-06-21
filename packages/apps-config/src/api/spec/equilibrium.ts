// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiInterfaceRx, AugmentedQuery, RxResult } from '@polkadot/api/types';
import type { AccountData, AccountId, AccountIndex, Address, Balance } from '@polkadot/types/interfaces';
import type { Codec, OverrideBundleDefinition } from '@polkadot/types/types';
import type { Observable } from '@polkadot/x-rxjs';

import { equilibrium } from '@equilab/definitions';
import BN from 'bn.js';

import { Enum } from '@polkadot/types';
import { map } from '@polkadot/x-rxjs/operators';

interface SignedBalance extends Enum {
  readonly isPositive: boolean;
  readonly asPositive: Balance;
  readonly isNegative: boolean;
  readonly asNegative: Balance;
}

interface Currency extends Enum {
  readonly isUnknown: boolean;
  readonly isUsd: boolean;
  readonly isEq: boolean;
  readonly isEth: boolean;
  readonly isBtc: boolean;
  readonly isEos: boolean;
  readonly isDot: boolean;
}

type CommonBalanceMap = ApiInterfaceRx['query']['balances']['account'];

type EqBalanceDoubleMap<T> = AugmentedQuery<
'rxjs',
(key1: AccountIndex | AccountId | Address | string, key2: T | string) => Observable<SignedBalance>,
[AccountId, Currency]
>

const transformBalanceStorage = <T>(
  query: EqBalanceDoubleMap<T>,
  currency: string,
  transform: <SB extends Enum>(data: SB) => AccountData,
  currencyToAsset: (arg: string) => T
): CommonBalanceMap => {
  const arg = currencyToAsset(currency);

  // HACK as we cannot properly transform queryMulti result, define AccountData getters on standard Enum
  if (!(Enum as { hacked?: boolean }).hacked) {
    (Enum as { hacked?: boolean }).hacked = true;

    for (const prop of ['free', 'reserved', 'miscFrozen', 'feeFrozen'] as Array<keyof AccountData>) {
      Object.defineProperty(Enum.prototype, prop, {
        get () {
          const accData: AccountData = transform(this as Enum);

          return accData[prop];
        },
        set () {
          // Do nothing
        }
      });
    }
  }

  // Transform result if we call the func normally
  const boundFunction = (account: AccountIndex | AccountId | Address | string) =>
    query(account, arg).pipe(map(transform));

  // Bind currency as second key for doubleMap for queryMulti
  const boundCreator = (account: AccountIndex | AccountId | Address | string) =>
    query.creator([account, arg]);

  Object.assign(boundCreator, { ...query.creator });

  return Object.assign(boundFunction, { ...query, creator: boundCreator } as unknown as CommonBalanceMap);
};

const signedBalancePredicate = (raw: Codec): raw is SignedBalance =>
  ['asNegative', 'asPositive', 'isNegative', 'isPositive'].some((key) =>
    Object.prototype.hasOwnProperty.call(raw, key)
  );

export const createCustomAccount = <A = string>(currency: string, currencyToAsset: (curr: string) => A, accountDataType = 'AccountData'):
(instanceId: string, api: ApiInterfaceRx) => RxResult<(arg: string | Uint8Array | AccountId) => Observable<AccountData>> => (instanceId: string, api: ApiInterfaceRx) => {
  const registry = api.registry;

  const transform = <SB extends Enum>(balance: SB): AccountData => {
    let free = registry.createType('Balance');
    const reserved = registry.createType('Balance');
    const miscFrozen = registry.createType('Balance');
    const feeFrozen = registry.createType('Balance');

    if (signedBalancePredicate(balance)) {
      if (balance.isPositive) {
        free = registry.createType('Balance', balance.asPositive);
      } else if (balance.isNegative) {
        free = registry.createType('Balance', balance.asNegative.mul(new BN(-1)));
      }
    }

    return registry.createType(accountDataType as 'AccountData', { feeFrozen, free, miscFrozen, reserved });
  };

  return transformBalanceStorage(
    api.query.eqBalances.account as unknown as EqBalanceDoubleMap<A>,
    currency,
    transform,
    currencyToAsset
  );
};

const definitions: OverrideBundleDefinition = {
  derives: {
    ...equilibrium.instances.balances.reduce(
      (all, cur) => ({
        ...all,
        [cur]: {
          customAccount: createCustomAccount(cur, (currency: string) => currency)
        }
      }),
      {}
    )
  },

  instances: equilibrium.instances,

  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: equilibrium.types
    }
  ]
};

export default definitions;
