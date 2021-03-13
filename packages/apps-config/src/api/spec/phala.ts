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
        EcdsaSignature: '[u8; 65]',
        EthereumAddress: 'H160',
        EthereumTxHash: 'H256',
        MiningInfo: {
          isMining: 'bool',
          startBlock: 'Option<BlockNumber>'
        },
        PayoutPrefs: {
          commission: 'u32',
          target: 'AccountId'
        },
        Score: {
          features: 'Vec<u32>',
          overallScore: 'u32'
        },
        StashInfo: {
          controller: 'AccountId',
          payoutPrefs: 'PayoutPrefs'
        },
        WorkerInfo: {
          machineId: 'Vec<u8>',
          pubkey: 'Vec<u8>',
          lastUpdated: 'u64',
          score: 'Option<Score>',
          status: 'i32'
        }
      }
    }
  ]
};

export default definitions;
