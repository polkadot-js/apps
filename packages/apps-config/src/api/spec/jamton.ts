// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

/* eslint-disable sort-keys */
const definitions: OverrideBundleDefinition = {
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
        StakingRates: {
          collatorStakingRate: 'Perquintill',
          collatorRewardRate: 'Perquintill',
          delegatorStakingRate: 'Perquintill',
          delegatorRewardRate: 'Perquintill'
        },
        AssetId: 'u32',
        Balance: 'u128'
      }
    }
  ],
  runtime: {
    ParachainStaking: [
      {
        methods: {
          get_staking_rates: {
            description: 'Calculate the current staking and reward rates for collators and delegators',
            params: [],
            type: 'StakingRates'
          },
          get_unclaimed_staking_rewards: {
            description: 'Calculate the claimable staking rewards for a given account address',
            params: [
              {
                name: 'account',
                type: 'AccountId32'
              }
            ],
            type: 'Balance'
          }
        },
        version: 1
      }
    ]
  },
  signedExtensions: {
    ChargeAssetTxPayment: {
      extrinsic: {
        tip: 'Compact<Balance>',
        assetId: 'Option<AssetId>'
      },
      payload: {}
    }
  }
};

export default definitions;
