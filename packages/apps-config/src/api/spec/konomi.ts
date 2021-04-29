// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
        Address: "AccountId",
        AssetId: "u64",
        FeeRate: "u64",
        LookupSource: "AccountId",
        Balance: "u128",
        User: {
          "borrowLimit": "Balance",
          "supplyBalance": "Balance",
          "debtBalance": "Balance"
        },
        Pool: {
          enabled: "bool",
          canBeCollateral: "bool",
          asset: "AssetId",
          supply: "Balance",
          debt: "Balance",
          safeFactor: "u128",
          closeFactor: "u128",
          discountFactor: "u128",
          totalSupplyIndex: "u128",
          totalDebtIndex: "u128",
          lastUpdated: "BlockNumber",
          utilizationFactor: "u128",
          initialInterestRate: "u128"
        },
        UserSupply: {
          "amount": "Balance",
          "index": "u128"
        },
        UserDebt: {
          "amount": "Balance",
          "index": "u128"
        }
      }
    }
  ]
};

export default definitions;