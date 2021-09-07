// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { OverrideBundleDefinition } from '@polkadot/types/types';

export const definitions: OverrideBundleDefinition = {
  types: [{
    // on all versions
    minmax: [0, undefined],
    types: {
      // common types
      Address: 'MultiAddress',
      AuthorityId: '[u8;32]',
      AuthoritySignature: '[u8;64]',
      BlockHash: 'PangoroBlockHash',
      BridgedBlockHash: 'RialtoBlockHash',
      BridgedBlockNumber: 'RialtoBlockNumber',
      BridgedHeader: 'RialtoHeader',
      Fee: 'PangoroBalance',
      KtonBalance: 'Balance',
      LookupSource: 'Address',
      // Pangoro types
      PangoroBalance: 'Balance',
      PangoroBlockHash: 'Hash',
      PangoroBlockNumber: 'BlockNumber',
      PangoroDigest: {
        logs: 'Vec<PangoroDigestItem>'
      },
      PangoroDigestItem: {
        _enum: {
          AuthoritiesChange: 'Vec<AuthorityId>',
          ChangesTrieRoot: 'PangoroBlockHash',
          Consensus: 'Consensus',
          Other: 'Vec<u8>',
          PreRuntime: 'PreRuntime',
          Seal: 'Seal',
          SealV0: 'SealV0'
        }
      },
      PangoroHeader: {
        digest: 'PangoroDigest',
        extrinsics_root: 'PangoroBlockHash',
        number: 'Compact<PangoroBlockNumber>',
        parent_Hash: 'PangoroBlockHash',
        state_root: 'PangoroBlockHash'
      },
      Parameter: {
        _enum: {
          PangoroToRialtoConversionRate: 'u128'
        }
      },
      Power: 'u32',
      // Rialto types
      RialtoBalance: 'u128',
      RialtoBlockHash: 'H256',
      RialtoBlockNumber: 'u32',
      RialtoDigest: {
        logs: 'Vec<RialtoDigestItem>'
      },
      RialtoDigestItem: {
        _enum: {
          AuthoritiesChange: 'Vec<AuthorityId>',
          ChangesTrieRoot: 'RialtoBlockHash',
          Consensus: 'Consensus',
          Other: 'Vec<u8>',
          PreRuntime: 'PreRuntime',
          Seal: 'Seal',
          SealV0: 'SealV0'
        }
      },
      RialtoHeader: {
        digest: 'RialtoDigest',
        extrinsics_root: 'RialtoBlockHash',
        number: 'Compact<RialtoBlockNumber>',
        parent_Hash: 'RialtoBlockHash',
        state_root: 'RialtoBlockHash'
      },
      RingBalance: 'Balance'
    }
  }]
};

export default definitions;
