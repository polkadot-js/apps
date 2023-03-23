// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Observable } from 'rxjs';
import type { ApiInterfaceRx, AugmentedQuery, RxResult } from '@polkadot/api/types';
import type { AccountData, AccountId, AccountIndex, Address, Balance } from '@polkadot/types/interfaces';
import type { Codec, OverrideBundleDefinition } from '@polkadot/types/types';
import type { Struct, u64, u128, Vec } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';

import eqDefs from '@equilab/definitions';
import { map } from 'rxjs';

import { memo } from '@polkadot/api-derive/util';
import { Enum } from '@polkadot/types';
import { BN } from '@polkadot/util';

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

const { equilibrium, equilibriumNext } = eqDefs;

export const u64FromCurrency = (currency: string): number => {
  const buf = Buffer.from(currency.toLowerCase());
  const size = buf.length;

  return buf.reduce(
    (val, digit, i) => val + Math.pow(256, size - 1 - i) * digit,
    0
  );
};

const transformBalanceStorage = <T>(
  query: EqBalanceDoubleMap<T>,
  currency: string,
  transform: <SB extends Enum>(data: SB) => AccountData,
  currencyToAsset: (arg: string, api?: ApiInterfaceRx) => T,
  api?: ApiInterfaceRx
): CommonBalanceMap => {
  const arg = currencyToAsset(currency, api);

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

export const createCustomAccount = <A = string>(currency: string, currencyToAsset: (curr: string, api?: ApiInterfaceRx) => A, accountDataType = 'AccountData'):
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
    currencyToAsset,
    api
  );
};

const TOKENS = ['eq', 'eqd', 'eqdot', 'dot', 'intr', 'ibtc', 'usdt'];

interface EqPrimitivesBalanceAccountData extends Enum {
  readonly isV0: boolean;
  readonly asV0: {
    readonly lock: u128;
    readonly balance: Vec<ITuple<[u64, EqPrimitivesSignedBalance]>>;
  } & Struct;
  readonly type: 'V0';
}

interface EqPrimitivesSignedBalance extends Enum {
  readonly isPositive: boolean;
  readonly asPositive: u128;
  readonly isNegative: boolean;
  readonly asNegative: u128;
  readonly type: 'Positive' | 'Negative';
}

const definitions: OverrideBundleDefinition = {
  derives: TOKENS.reduce((prev, token, i) => ({
    ...prev,

    [token]: { customAccount: (instanceId: string, api: ApiInterfaceRx) => {
      const { registry } = api;
      const asset = u64FromCurrency(token);

      return memo(instanceId, (address: AccountIndex | AccountId | Address | string) => api.query.system.account(address).pipe(map((v) => {
        const isNative = i === 0;
        const data = (v as unknown as { data: EqPrimitivesBalanceAccountData }).data;

        const miscFrozen = isNative
          ? data.asV0.lock
          : registry.createType('u128', 0);

        const feeFrozen = miscFrozen;
        const reserved = registry.createType('u128', 0);

        const entry = data.asV0.balance.find(([assetId]) => {
          return assetId.toNumber() === asset;
        });

        const balance = entry?.[1];

        const free = balance?.isPositive
          ? balance.asPositive
          : registry.createType('u128', 0);

        return {
          feeFrozen, free, miscFrozen, reserved
        };
      })));
    } }
  }), {}),
  instances: { balances: TOKENS }
};

export default definitions;
