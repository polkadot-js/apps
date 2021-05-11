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
        Address: 'AccountId',
        NFTId: 'u32',
        NFTIdOf: 'NFTId',
        NFTData: {
          owner: 'AccountId',
          details: 'NFTDetails',
          sealed: 'bool',
          locked: 'bool'
        },
        NFTDetails: {
          offchain_uri: 'Vec<u8>'
        },
        NFTSeriesDetails: {
          owner: 'AccountId',
          nfts: 'Vec<NFTId>'
        },
        NFTSeriesId: 'u32',
        LookupSource: 'AccountId'
      }
    }
  ]
};

export default definitions;
