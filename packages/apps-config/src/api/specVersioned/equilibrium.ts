// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { Enum, Struct } from '@polkadot/types';
import type { Option } from '@polkadot/types/codec';
import type { AccountId, AccountIndex, AccountInfo, Address, Balance, BlockNumber, Index } from '@polkadot/types/interfaces';
import type { Observable } from '@polkadot/x-rxjs';

import { memo } from '@polkadot/api-derive/util/memo';
import { combineLatest, of } from '@polkadot/x-rxjs';
import { map, switchMap } from '@polkadot/x-rxjs/operators';

interface VestingInfo extends Struct {
  readonly locked: Balance;
  readonly perBlock: Balance;
  readonly startingBlock: BlockNumber;
}

interface SignedBalance extends Enum {
  readonly isPositive: boolean;
  readonly asPositive: Balance;
  readonly isNegative: boolean;
  readonly asNegative: Balance;
}

export interface EQDeriveBalancesAll {
  freeBalance: Balance;
  reservedBalance: Balance;
  vestingLocked: Balance;
  lockedBalance: Balance;
  accountId: AccountId;
  accountNonce: Index;
  lockedBreakdown: unknown[];
}

type Result = [Balance, Balance, Balance, Index];

type RawResult = [
  SignedBalance,
  Option<Balance>,
  Option<VestingInfo>,
  AccountInfo
];

type EQDeriveBalancesAccountQuery = (
  address: AccountIndex | AccountId | Address | string
) => Observable<{ accountNonce: Index; }>;

type EQDeriveBalancesAllQuery = (
  address: AccountIndex | AccountId | Address | string
) => Observable<EQDeriveBalancesAll>;

export default {
  derives: {
    // TODO derive.democracy.locks
    // TODO derice.staking.account
    balances: {
      account: (
        // Compatibility with calc tx fee
        instanceId: string,
        api: ApiInterfaceRx
      ): EQDeriveBalancesAccountQuery =>
        memo(
          instanceId,
          (address: AccountId | AccountIndex | Address | string) =>
            api.derive.accounts.accountId(address).pipe(
              switchMap(
                (accountId): Observable<[AccountId, [Index]]> =>
                  accountId
                    ? combineLatest([
                      of(accountId),
                      api
                        .queryMulti([
                          [api.query.system.account, accountId]
                        ])
                        .pipe(
                          map((raw): [Index] => {
                            if (raw.length < 1) {
                              throw new Error('Data expected');
                            }

                            const data = raw as [AccountInfo];

                            return [data[0].nonce];
                          })
                        )
                    ])
                    : of([
                      api.registry.createType('AccountId'),
                      [api.registry.createType('Index')]
                    ])
              ),
              map(([, [accountNonce]]) => ({ accountNonce }))
            )
        ),
      all: (
        // Compatibility for account balance in explorer
        instanceId: string,
        api: ApiInterfaceRx
      ): EQDeriveBalancesAllQuery =>
        memo(
          instanceId,
          (address: AccountIndex | AccountId | Address | string) =>
            api.derive.accounts.accountId(address).pipe(
              switchMap(
                (accountId): Observable<[AccountId, Result]> =>
                  accountId
                    ? combineLatest([
                      of(accountId),
                      api
                        .queryMulti([
                          [api.query.balances.account, [accountId, 'EQ']],
                          [api.query.eqVesting.vested, accountId],
                          [api.query.eqVesting.vesting, accountId],
                          [api.query.system.account, accountId]
                        ])
                        .pipe(
                          map(
                            (raw): Result => {
                              if (raw.length < 4) {
                                throw new Error('4 members expected');
                              }

                              const res = raw as RawResult;
                              const freeBalance = res[0].asPositive;

                              let reservedBalance = api.registry.createType(
                                'Balance'
                              );

                              let vestingLocked = api.registry.createType(
                                'Balance'
                              );

                              if (res[1].isSome && res[2].isSome) {
                                const vested = res[1].unwrap();
                                const info = res[2].unwrap();

                                vestingLocked = info.locked;

                                reservedBalance = api.registry.createType(
                                  'Balance',
                                  vestingLocked.sub(vested)
                                );
                              }

                              return [
                                freeBalance,
                                reservedBalance,
                                vestingLocked,
                                res[3].nonce
                              ];
                            }
                          )
                        )
                    ])
                    : of([
                      api.registry.createType('AccountId'),
                      [
                        api.registry.createType('Balance'),
                        api.registry.createType('Balance'),
                        api.registry.createType('Balance'),
                        api.registry.createType('Index')
                      ]
                    ])
              ),
              map(
                ([
                  accountId,
                  [freeBalance, reservedBalance, vestingLocked, accountNonce]
                ]): EQDeriveBalancesAll => ({
                  accountId,
                  accountNonce,
                  freeBalance,
                  lockedBalance: vestingLocked,
                  lockedBreakdown: [],
                  reservedBalance,
                  vestingLocked
                })
              )
            )
        )
    }
  }
};
