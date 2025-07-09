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
        Satoshis: 'u64'
      }
    }
  ],
  runtime: {
    MiningSlotApi: [
      {
        methods: {
          next_slot_era: {
            description: 'Get the next slot block start and end',
            params: [],
            type: '(BlockNumber, BlockNumber)'
          }
        },
        version: 1
      }
    ],
    BitcoinApis: [
      {
        methods: {
          redemption_rate: {
            description: 'Get the current redemption rate for a given number of satoshis',
            params: [
              {
                name: 'satoshis',
                type: 'Satoshis'
              }
            ],
            type: 'Balance'
          },
          market_rate: {
            description: 'Get the current market rate for a given number of satoshis',
            params: [
              {
                name: 'satoshis',
                type: 'Satoshis'
              }
            ],
            type: 'Balance'
          }
        },
        version: 1
      }
    ]
  }
};

export default definitions;
