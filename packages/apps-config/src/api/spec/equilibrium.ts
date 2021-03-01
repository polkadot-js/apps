// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { Enum } from '@polkadot/types';
import type { AccountData, AccountId, AccountIndex, Address, Balance } from '@polkadot/types/interfaces';
import type { Codec, OverrideBundleDefinition } from '@polkadot/types/types';

import BN from 'bn.js';

import { memo } from '@polkadot/api-derive/util/memo';
import { map } from '@polkadot/x-rxjs/operators';

// structs need to be in order
/* eslint-disable sort-keys */

interface SignedBalance extends Enum {
  readonly isPositive: boolean;
  readonly asPositive: Balance;
  readonly isNegative: boolean;
  readonly asNegative: Balance;
}

const currencies = ['Unknown', 'Usd', 'EQ', 'Eth', 'Btc', 'Eos', 'Dot'];

const signedBalancePredicate = (raw: Codec): raw is SignedBalance =>
  ['asNegative', 'asPositive', 'isNegative', 'isPositive']
    .some((key) => Object.prototype.hasOwnProperty.call(raw, key));

const definitions: OverrideBundleDefinition = {
  instances: {
    balances: currencies
  },

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
    ...currencies.reduce((all, cur) => ({ ...all,
      [cur]: {
        customAccount: (instanceId: string, api: ApiInterfaceRx) =>
          memo(
            instanceId,
            (address: AccountIndex | AccountId | Address | string) =>
              api.query.balances.account(address, cur).pipe(map(
                (balance): AccountData => {
                  let free = api.registry.createType('Balance');
                  const reserved = api.registry.createType('Balance');
                  const miscFrozen = api.registry.createType('Balance');
                  const feeFrozen = api.registry.createType('Balance');

                  if (signedBalancePredicate(balance)) {
                    if (balance.isPositive) {
                      free = api.registry.createType('Balance', balance.asPositive);
                    } else if (balance.isNegative) {
                      free = api.registry.createType(
                        'Balance',
                        balance.asNegative.mul(new BN(-1))
                      );
                    }
                  }

                  return api.registry.createType(
                    'AccountData',
                    { free, reserved, miscFrozen, feeFrozen }
                  );
                }))
          )
      } }), {})
  }
};

export default definitions;
