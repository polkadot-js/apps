// Copyright 2017-2022 @polkadot/apps-config authors & contributors
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
        Token: 'u8',
        DEXShare: '(u8, u8)',
        CurrencyId: {
          _enum: {
            Token: 'Token',
            DEXShare: 'DEXShare'
          }
        },
        TradingPair: '(CurrencyId, CurrencyId)',
        CurrencyIds: { _: 'Vec<CurrencyId>' },
        TradingPairProvisionParameters: {
          min_contribution: '(Balance, Balance)',
          target_provision: '(Balance, Balance)',
          accumulated_provision: '(Balance, Balance)',
          not_before: 'BlockNumber'
        },
        TradingPairStatus: {
          _enum: {
            NotEnabled: null,
            Provisioning: 'TradingPairProvisionParameters',
            Enabled: null
          }
        },
        PoolId: 'CurrencyId',
        Price: 'FixedU128',
        OracleKey: 'u8',
        OracleValue: 'FixedU128',
        Amount: 'i128',
        Balance: 'u128',
        Ratio: 'FixedU128',
        InterestInfo: {
          critical_point: 'Ratio',
          base: 'Ratio',
          slope_1: 'Ratio',
          slope_2: 'Ratio'
        },
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
        LoanInfo: {
          deposit: 'Balance',
          debit: 'Balance'
        },
        TimestampedValue: {
          value: 'OracleValue',
          timestamp: 'u64'
        },
        PoolInfo: {
          total_shares: 'Compact<u128>',
          total_rewards: 'Compact<u128>',
          total_withdrawn_rewards: 'Compact<u128>'
        }
      }
    }
  ]
};

export default definitions;
