// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { Enum, Struct } from '@polkadot/types';
import type { Option } from '@polkadot/types/codec';
import type { AccountId, AccountIndex, AccountInfo, Address, Balance, BlockNumber, Index } from '@polkadot/types/interfaces';
import type { OverrideBundleDefinition } from '@polkadot/types/types';
import type { Observable } from '@polkadot/x-rxjs';

import { memo } from '@polkadot/api-derive/util/memo';
import { combineLatest, of } from '@polkadot/x-rxjs';
import { map, switchMap } from '@polkadot/x-rxjs/operators';

// structs need to be in order
/* eslint-disable sort-keys */

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
  additional: []; // fix until vesting instances are supported in api-derive
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

const definitions: OverrideBundleDefinition = {
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
        Address: 'AccountId',
        Balance: 'u64',
        BalanceOf: 'Balance',
        BalancesAggregate: {
          total_issuance: 'Balance',
          total_debt: 'Balance'
        },
        BlockNumber: 'u64',
        ChainId: 'u8',
        Currency: {
          _enum: ['Unknown', 'Usd', 'EQ', 'Eth', 'Btc', 'Eos', 'Dot']
        },
        DataPoint: {
          price: 'u64',
          account_id: 'AccountId',
          block_number: 'BlockNumber',
          timestamp: 'u64'
        },
        DepositNonce: 'u64',
        FixedI64: 'i64',
        Keys: 'SessionKeys3',
        LookupSource: 'AccountId',
        OperationRequest: {
          account: 'AccountId',
          authority_index: 'AuthIndex',
          validators_len: 'u32',
          block_num: 'BlockNumber'
        },
        PricePayload: 'Data',
        PricePeriod: {
          _enum: ['Min', 'TenMin', 'Hour', 'FourHour', 'Day']
        },
        PricePoint: {
          block_number: 'BlockNumber',
          timestamp: 'u64',
          price: 'u64',
          data_points: 'Vec<DataPoint>'
        },
        ProposalStatus: {
          _enum: [
            'Initiated',
            'Approved',
            'Rejected'
          ]
        },
        ProposalVotes: {
          votes_for: 'Vec<AccountId>',
          votes_against: 'Vec<AccountId>',
          status: 'ProposalStatus',
          expiry: 'BlockNumber'
        },
        ReinitRequest: {
          account: 'AccountId',
          authority_index: 'AuthIndex',
          validators_len: 'u32',
          block_num: 'BlockNumber'
        },
        ResourceId: '[u8; 32]',
        SignedBalance: {
          _enum: {
            Positive: 'Balance',
            Negative: 'Balance'
          }
        },
        SubAccType: {
          _enum: ['Bailsman', 'Borrower', 'Lender']
        },
        TotalAggregates: {
          collateral: 'Balance',
          debt: 'Balance'
        },
        TransferReason: {
          _enum: [
            'Common',
            'InterestFee',
            'MarginCall',
            'BailsmenRedistribution',
            'TreasuryEqBuyout',
            'TreasuryBuyEq',
            'Subaccount'
          ]
        },
        UserGroup: {
          _enum: ['Unknown', 'Balances', 'Bailsmen', 'Borrowers', 'Lenders']
        },
        VestingInfo: {
          locked: 'Balance',
          perBlock: 'Balance',
          startingBlock: 'BlockNumber'
        }
      }
    }
  ],
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
                  additional: [],
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

export default definitions;
