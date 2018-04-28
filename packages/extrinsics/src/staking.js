// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicsBasic } from './types';

module.exports = ({
  description: 'Staking',
  methods: {
    public: [
      {
        description: 'Transfer',
        index: 0,
        name: 'transfer',
        params: [
          { name: 'recipient', type: 'AccountId' },
          { name: 'value', type: 'Balance', options: { minValue: 1 } }
        ]
      },
      {
        description: 'Stake',
        index: 1,
        name: 'stake',
        params: []
      },
      {
        description: 'Unstake',
        index: 2,
        name: 'unstake',
        params: []
      }
    ],
    private: [
      {
        description: 'Set sessions per era',
        index: 0,
        name: 'setSessionsPerEra',
        params: [
          { name: 'sessions', type: 'u64' }
        ]
      },
      {
        description: 'Set bonding duration',
        index: 1,
        name: 'setBondingDuration',
        params: [
          { name: 'duration', type: 'u64' }
        ]
      },
      {
        description: 'Set validator count',
        index: 2,
        name: 'setValidatorCount',
        params: [
          { name: 'count', type: 'u32' }
        ]
      },
      {
        description: 'Force new era',
        index: 3,
        name: 'forceNewEra',
        params: []
      }
    ]
  }
}: ExtrinsicsBasic);
