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
        }
      }
    }
  ],
  runtime: {
    Staking: [
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
          },
          get_sorted_proposed_candidates: {
            description: 'Provides a sorted list of collators most suited for given delegator\'s stake amount determined with some heuristic algorithm',
            params: [
              {
                name: 'balance',
                type: 'Balance'
              }
            ],
            type: 'Vec<AccountId32>'
          }
        },
        version: 1
      }
    ]
  }
};

export default definitions;
