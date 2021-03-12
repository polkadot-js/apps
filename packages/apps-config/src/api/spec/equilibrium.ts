// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiInterfaceRx, AugmentedQuery, AugmentedQueryDoubleMap } from "@polkadot/api/types";
import type { AccountData, AccountId, AccountIndex, Address, Balance } from "@polkadot/types/interfaces";
import type { Codec, OverrideBundleDefinition } from "@polkadot/types/types";
import type { Observable } from "@polkadot/x-rxjs";

import BN from "bn.js";

import { Enum } from "@polkadot/types";
import { map } from "@polkadot/x-rxjs/operators";

// structs need to be in order
/* eslint-disable sort-keys */

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

const transformBalanceStorage = (
  query: AugmentedQueryDoubleMap<
    "rxjs",
    (key1: AccountIndex | AccountId | Address | string, key2: Currency | string) => Observable<SignedBalance>,
    [AccountId, Currency]
  >,
  arg: Currency | string,
  transform: <SB extends Enum>(data: SB) => AccountData
): AugmentedQuery<any, (key: AccountIndex | AccountId | Address | string) => Observable<AccountData>, [AccountId]> => {
  // HACK as we cannot properly transform queryMulti result, define AccountData getters on standard Enum
  // @ts-ignore
  if (!Enum.hacked) {
    // @ts-ignore
    Enum.hacked = true;

    for (const prop of ["free", "reserved", "miscFrozen", "feeFrozen"] as Array<keyof AccountData>) {
      Object.defineProperty(Enum.prototype, prop, {
        get() {
          const accData = transform(this);
          return accData[prop];
        },
        set(val) {
        }
      })
    }
  }

  // Transform result if we call the func normally
  const boundFunction = (account: AccountIndex | AccountId | Address | string) =>
    query(account, arg).pipe(map(transform));

  // Bind currency as second key for doubleMap for queryMulti
  const boundCreator = (account: AccountIndex | AccountId | Address | string) =>
    query.creator([account, arg]);

  //@ts-ignore
  return Object.assign(boundFunction, { ...query, creator: Object.assign(boundCreator, { ...query.creator }) });
};

const currencies = ["Unknown", "Usd", "EQ", "Eth", "Btc", "Eos", "Dot"];

const signedBalancePredicate = (raw: Codec): raw is SignedBalance =>
  ["asNegative", "asPositive", "isNegative", "isPositive"].some((key) =>
    Object.prototype.hasOwnProperty.call(raw, key)
  );

const definitions: OverrideBundleDefinition = {
  instances: {
    balances: currencies,
  },

  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
        AccountData: {
          free: "Balance",
          reserved: "Balance",
          miscFrozen: "Balance",
          feeFrozen: "Balance"
        },
        Address: "AccountId",
        Balance: "u64",
        BalanceOf: "Balance",
        BalancesAggregate: {
          total_issuance: "Balance",
          total_debt: "Balance",
        },
        BlockNumber: "u64",
        ChainId: "u8",
        Currency: {
          _enum: ["Unknown", "Usd", "EQ", "Eth", "Btc", "Eos", "Dot"],
        },
        DataPoint: {
          price: "u64",
          account_id: "AccountId",
          block_number: "BlockNumber",
          timestamp: "u64",
        },
        DepositNonce: "u64",
        FixedI64: "i64",
        Keys: "SessionKeys3",
        LookupSource: "AccountId",
        OperationRequest: {
          account: "AccountId",
          authority_index: "AuthIndex",
          validators_len: "u32",
          block_num: "BlockNumber",
        },
        PricePayload: "Data",
        PricePeriod: {
          _enum: ["Min", "TenMin", "Hour", "FourHour", "Day"],
        },
        PricePoint: {
          block_number: "BlockNumber",
          timestamp: "u64",
          price: "u64",
          data_points: "Vec<DataPoint>",
        },
        ProposalStatus: {
          _enum: ["Initiated", "Approved", "Rejected"],
        },
        ProposalVotes: {
          votes_for: "Vec<AccountId>",
          votes_against: "Vec<AccountId>",
          status: "ProposalStatus",
          expiry: "BlockNumber",
        },
        ReinitRequest: {
          account: "AccountId",
          authority_index: "AuthIndex",
          validators_len: "u32",
          block_num: "BlockNumber",
        },
        ResourceId: "[u8; 32]",
        SignedBalance: {
          _enum: {
            Positive: "Balance",
            Negative: "Balance",
          },
        },
        SubAccType: {
          _enum: ["Bailsman", "Borrower", "Lender"],
        },
        TotalAggregates: {
          collateral: "Balance",
          debt: "Balance",
        },
        TransferReason: {
          _enum: [
            "Common",
            "InterestFee",
            "MarginCall",
            "BailsmenRedistribution",
            "TreasuryEqBuyout",
            "TreasuryBuyEq",
            "Subaccount",
          ],
        },
        UserGroup: {
          _enum: ["Unknown", "Balances", "Bailsmen", "Borrowers", "Lenders"],
        },
        VestingInfo: {
          locked: "Balance",
          perBlock: "Balance",
          startingBlock: "BlockNumber",
        },
      },
    },
  ],
  derives: {
    ...currencies.reduce(
      (all, cur) => ({
        ...all,
        [cur]: {
          customAccount: (instanceId: string, api: ApiInterfaceRx) => {
            const registry = api.registry;

            const transform = <SB extends Enum>(balance: SB): AccountData => {
              let free = registry.createType("Balance");
              const reserved = registry.createType("Balance");
              const miscFrozen = registry.createType("Balance");
              const feeFrozen = registry.createType("Balance");

              if (signedBalancePredicate(balance)) {
                if (balance.isPositive) {
                  free = registry.createType("Balance", balance.asPositive);
                } else if (balance.isNegative) {
                  free = registry.createType("Balance", balance.asNegative.mul(new BN(-1)));
                }
              }

              return registry.createType("AccountData", { free, reserved, miscFrozen, feeFrozen });
            };

            return transformBalanceStorage(
              // @ts-ignore
              api.query.balances.account,
              cur,
              transform
            )
          },
        },
      }),
      {}
    ),
  },
};

export default definitions;
