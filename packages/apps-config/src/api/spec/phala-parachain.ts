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
        EthereumAddress: 'H160',
        EcdsaSignature: '[u8; 65]',
        EthereumTxHash: 'H256',
        WorkerStateEnum: {
          _enum: {
            Empty: null,
            Free: null,
            Gatekeeper: null,
            MiningPending: null,
            Mining: 'BlockNumber',
            MiningStopping: null
          }
        },
        WorkerInfo: {
          machineId: 'Vec<u8>',
          pubkey: 'Vec<u8>',
          lastUpdated: 'u64',
          state: 'WorkerStateEnum',
          score: 'Option<Score>'
        },
        Score: {
          overallScore: 'u32',
          features: 'Vec<u32>'
        },
        StashInfo: {
          controller: 'AccountId',
          payoutPrefs: 'PayoutPrefs'
        },
        PayoutPrefs: {
          commission: 'u32',
          target: 'AccountId'
        },
        BlockRewardInfo: {
          seed: 'U256',
          onlineTarget: 'U256',
          computeTarget: 'U256'
        },
        RoundInfo: {
          round: 'u32',
          startBlock: 'BlockNumber'
        },
        RoundStats: {
          round: 'u32',
          onlineWorkers: 'u32',
          computeWorkers: 'u32',
          fracTargetOnlineReward: 'u32',
          totalPower: 'u32'
        },
        MinerStatsDelta: {
          numWorker: 'i32',
          numPower: 'i32'
        }
      }
    }
  ]
};

export default definitions;
