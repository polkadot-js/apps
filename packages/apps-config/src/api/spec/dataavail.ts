// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  types: [
    {
      types: {
        AppId: 'u32',
        DataLookup: {
          size: 'u32',
          index: 'Vec<(AppId,u32)>'
        },
        KateExtrinsicRoot: {
          hash: 'Hash',
          commitment: 'Vec<u8>',
          rows: 'u16',
          cols: 'u16'
        },
        KateHeader: {
          parentHash: 'Hash',
          number: 'Compact<BlockNumber>',
          stateRoot: 'Hash',
          extrinsicsRoot: 'KateExtrinsicRoot',
          digest: 'Digest',
          app_data_lookup: 'DataLookup'
        },
        Header: 'KateHeader',
        CheckAppId: {
          extra: {
            appId: 'u32', 
          },
          types: {}
        }
      },
      signedExtensions: {
        CheckAppId: {
          extrinsic: {
            appId: 'u32'
          },
          payload: {}
        },
      }
    }
  ]
};

export default definitions;
