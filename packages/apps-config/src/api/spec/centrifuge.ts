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
        AnchorData: {
          id: 'Hash',
          docRoot: 'Hash',
          anchoredBlock: 'u64'
        },
        ChainId: 'u8',
        'chainbridge::ChainId': 'u8',
        DepositNonce: 'u64',
        Fee: {
          key: 'Hash',
          price: 'Balance'
        },
        ParachainAccountIdOf: 'AccountId',
        PreCommitData: {
          signingRoot: 'Hash',
          identity: 'AccountId',
          expirationBlock: 'u64'
        },
        Proof: {
          leafHash: 'Hash',
          sortedHashes: 'Vec<Hash>'
        },
        ProxyType: {
          _enum: [
            'Any',
            'NonTransfer',
            'Governance',
            '_Staking',
            'NonProxy'
          ]
        },
        ResourceId: '[u8; 32]',
        RelayChainAccountId: 'AccountId',
        RootHashOf: 'Hash'
      }
    }
  ]
};

export default definitions;
