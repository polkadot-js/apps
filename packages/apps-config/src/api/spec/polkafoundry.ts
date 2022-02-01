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
        RelayChainAccountId: 'H256',
        RoundIndex: 'u32',
        SettingStruct: {
          bond_duration: 'u32',
          blocks_per_round: 'u32',
          desired_target: 'u32'
        },
        Bond: {
          owner: 'AccountId',
          amount: 'Balance'
        },
        UnBondChunk: {
          value: 'Balance',
          round: 'u32'
        },
        StakingNominators: {
          nominations: 'Vec<Bond>',
          total: 'Balance',
          unbonding: 'Vec<UnBondChunk>',
          claimed_rewards: 'Vec<u32>'
        }
      }
    }
  ]
};

export default definitions;
