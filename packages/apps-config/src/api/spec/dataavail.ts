// Copyright 2017-2024 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  rpc: {
    kate: {
      blockLength: {
        description: 'Get Block Length',
        params: [
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'BlockLength'
      },
      queryProof: {
        description: 'Generate the kate proof for the given `cells`',
        params: [
          {
            name: 'cells',
            type: 'Vec<Cell>'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'Vec<u8>'
      },
      queryAppData: {
        description: 'Fetches app data rows for the given app',
        params: [
          {
            name: 'app_id',
            type: 'AppId'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'Vec<Option<Vec<u8>>>'
      },

      queryDataProof: {
        description: 'Generate the data proof for the given `transaction_index`',
        params: [
          {
            name: 'transaction_index',
            type: 'u32'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'DataProof'
      },
      queryDataProofV2: {
        description: 'Generate the data proof for the given `transaction_index`',
        params: [
          {
            name: 'transaction_index',
            type: 'u32'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'ProofResponse'
      }
    }
  },
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
        AppId: 'Compact<u32>',
        DataLookupIndexItem: {
          appId: 'AppId',
          start: 'Compact<u32>'
        },
        DataLookup: {
          size: 'Compact<u32>',
          index: 'Vec<DataLookupIndexItem>'
        },
        KateCommitment: {
          rows: 'Compact<u16>',
          cols: 'Compact<u16>',
          commitment: 'Vec<u8>',
          dataRoot: 'H256'
        },
        V1HeaderExtension: {
          appLookup: 'DataLookup',
          commitment: 'KateCommitment'
        },
        V2HeaderExtension: {
          appLookup: 'DataLookup',
          commitment: 'KateCommitment'
        },
        V3HeaderExtension: {
          appLookup: 'DataLookup',
          commitment: 'KateCommitment'
        },
        VTHeaderExtension: {
          newField: 'Vec<u8>',
          commitment: 'KateCommitment',
          appLookup: 'DataLookup'
        },
        HeaderExtension: {
          _enum: {
            V1: 'V1HeaderExtension',
            V2: 'V2HeaderExtension',
            V3: 'V3HeaderExtension',
            VTest: 'VTHeaderExtension'
          }
        },
        DaHeader: {
          parentHash: 'Hash',
          number: 'Compact<BlockNumber>',
          stateRoot: 'Hash',
          extrinsicsRoot: 'Hash',
          digest: 'Digest',
          extension: 'HeaderExtension'
        },
        Header: 'DaHeader',
        CheckAppIdExtra: {
          appId: 'AppId'
        },
        CheckAppIdTypes: {},
        CheckAppId: {
          extra: 'CheckAppIdExtra',
          types: 'CheckAppIdTypes'
        },
        BlockLengthColumns: 'Compact<u32>',
        BlockLengthRows: 'Compact<u32>',
        BlockLength: {
          max: 'PerDispatchClass',
          cols: 'BlockLengthColumns',
          rows: 'BlockLengthRows',
          chunkSize: 'Compact<u32>'
        },
        PerDispatchClass: {
          normal: 'u32',
          operational: 'u32',
          mandatory: 'u32'
        },
        DataProof: {
          root: 'H256',
          proof: 'Vec<H256>',
          numberOfLeaves: 'Compact<u32>',
          leafIndex: 'Compact<u32>',
          leaf: 'H256'
        },
        DataProofV2: {
          dataRoot: 'H256',
          blobRoot: 'H256',
          bridgeRoot: 'H256',
          proof: 'Vec<H256>',
          numberOfLeaves: 'Compact<u32>',
          leafIndex: 'Compact<u32>',
          leaf: 'H256'
        },
        ProofResponse: {
          dataProof: 'DataProofV2',
          message: 'Option<Message>'
        },
        Message: {
          messageType: 'MessageType',
          from: 'H256',
          to: 'H256',
          originDomain: 'u32',
          destinationDomain: 'u32',
          data: 'Vec<u8>',
          id: 'u64'
        },
        MessageType: {
          _enum: [
            'ArbitraryMessage',
            'FungibleToken'
          ]
        },
        Cell: {
          row: 'BlockLengthRows',
          col: 'BlockLengthColumns'
        }
      }
    }
  ],
  signedExtensions: {
    CheckAppId: {
      extrinsic: {
        appId: 'AppId'
      },
      payload: {}
    }
  }
};

console.log('Add DA definitions');

export default definitions;
