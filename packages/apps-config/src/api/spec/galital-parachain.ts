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
        Address: 'AccountId',
        LookupSource: 'AccountId',
        Account: {
          nonce: 'U256',
          balance: 'U256'
        },
        Transaction: {
          nonce: 'U256',
          action: 'String',
          gas_price: 'u64',
          gas_limit: 'u64',
          value: 'U256',
          input: 'Vec<u8>',
          signature: 'Signature'
        },
        Signature: {
          v: 'u64',
          r: 'H256',
          s: 'H256'
        },
        ClassId: 'u64',
        TokenId: 'u64',
        ClassData: 'Vec<u8>',
        TokenData: 'Vec<u8>',
        ReportReason: {
          _enum: [
            'None',
            'Illigal',
            'Plagiarism',
            'Duplicate',
            'Reported'
          ]
        },
        ClassInfoOf: {
          metadata: 'Vec<u8>',
          total_issuance: 'TokenId',

          owner: 'AccountId',
          class_data: 'ClassData'
        },
        ExtendedInfo: {
          display_flag: 'bool',
          report: 'ReportReason',
          frozen: 'bool'
        },
        TokenInfoOf: {
          metadata: 'Vec<u8>',
          owner: 'AccountId',
          class_data: 'ClassData'
        }
      }
    }
  ]
};

export default definitions;
