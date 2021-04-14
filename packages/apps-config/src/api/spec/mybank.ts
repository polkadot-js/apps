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
        Address: 'MultiAddress',
        LookupSource: 'MultiAddress',
        PoolId: 'u8',
        PoolIdOf: 'PoolId',
        Loans: 'u8',
        LoansOf: 'Loans',
        CurrencyId: 'u8',
        CurrencyIdOf: 'CurrencyId',
        AssetPoolId: 'u8',
        AssetPoolIdOf: 'AssetPoolId',
        Price: 'FixedU128',
        PriceOf: 'Price',
        OracleKey: 'u8',
        OracleKeyOf: 'OracleKey',
        OracleValue: 'FixedU128',
        OracleValueOf: 'OracleValue',
        Amount: 'i128',
        AmountOf: 'Amount',
        Balance: 'u128',
        BalanceOf: 'Balance',
        Ratio: 'FixedU128',
        RatioOf: 'Ratio',
        InterestInfo: {
          critical_point: 'Ratio',
          base: 'Ratio',
          slope_1: 'Ratio',
          slope_2: 'Ratio'
        },
        InterestInfoOf: 'InterestInfo',
        AssetPoolInfo: {
          maximum_total_debit_ratio: 'Ratio',
          minimum_deposit: 'Balance',
          minimum_debit: 'Balance',
          health_ratio: 'Ratio',
          total_deposit: 'Balance',
          total_debit: 'Balance',
          deposit_rate: 'Ratio',
          debit_rate: 'Ratio',
          deposit_apy: 'Ratio',
          debit_apy: 'Ratio',
          reserve_factor: 'Ratio',
          interest_info: 'InterestInfo'
        },
        AssetPoolInfoOf: 'AssetPoolInfo',
        LoanInfo: {
          deposit: 'Balance',
          debit: 'Balance'
        },
        LoanInfoOf: 'LoanInfo',
        TimestampedValue: {
          value: 'OracleValue',
          timestamp: 'u64'
        },
        TimestampedValueOf: 'TimestampedValue',
        PoolInfo: {
          total_shares: 'Compact<u128>',
          total_rewards: 'Compact<u128>',
          total_withdrawn_rewards: 'Compact<u128>'
        },
        PoolInfoOf: 'PoolInfo'
      }
    }
  ]
};

export default definitions;
