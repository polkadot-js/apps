// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicsBaseSection } from '@polkadot/extrinsics/types';

module.exports = ({
  description: 'Staking',
  methods: {
    public: {
      transfer: {
        description: 'Transfer',
        index: 0,
        params: {
          recipient: { type: 'AccountId' },
          value: { type: 'Balance', options: { minValue: 1 } }
        }
      },
      stake: {
        description: 'Stake',
        index: 1,
        params: {}
      },
      unstake: {
        description: 'Unstake',
        index: 2,
        params: {}
      }
    },
    private: {
      setSessionsPerEra: {
        description: 'Set sessions per era',
        index: 0,
        params: {
          sessions: { type: 'u64' }
        }
      },
      setBondingDuration: {
        description: 'Set bonding duration',
        index: 1,
        params: {
          duration: { type: 'u64' }
        }
      },
      setValidatorCount: {
        description: 'Set validator count',
        index: 2,
        params: {
          count: { type: 'u32' }
        }
      },
      forceNewEra: {
        description: 'Force new era',
        index: 3,
        params: {}
      }
    }
  }
}: ExtrinsicsBaseSection);
