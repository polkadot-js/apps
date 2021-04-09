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
        AnchorData: {
          id: 'H256',
          docRoot: 'H256',
          anchoredBlock: 'u64'
        },
        Fee: {
          key: 'Hash',
          price: 'Balance'
        },
        PreCommitData: {
          signingRoot: 'H256',
          identity: 'H256',
          expirationBlock: 'u64'
        },
        Proof: {
          leafHash: 'H256',
          sortedHashes: 'H256'
        },
        // MultiAccount
        MultiAccountData: {
          threshold: 'u16',
          signatories: 'Vec<AccountId>',
          deposit: 'Balance',
          depositor: 'AccountId'
        },
        // Bridge constants
        ChainId: 'u8',
        ResourceId: '[u8; 32]',
        'chainbridge::ChainId': 'u8',
        DepositNonce: 'u64',
        // NFT
        RegistryId: 'H160',
        TokenId: 'U256',
        AssetId: {
          registryId: 'RegistryId',
          tokenId: 'TokenId'
        },
        RegistryInfo: {
          ownerCanBurn: 'bool',
          fields: 'Vec<Bytes>'
        },
        AssetInfo: {
          metadata: 'Bytes'
        },
        ProofMint: {
          value: 'Bytes',
          property: 'Bytes',
          salt: '[u8; 32]',
          hashes: 'Vec<Hash>'
        },
        MintInfo: {
          anchorId: 'Hash',
          staticHashes: '[Hash; 3]',
          proofs: 'Vec<ProofMint>'
        }
      }
    }
  ]
};

export default definitions;
