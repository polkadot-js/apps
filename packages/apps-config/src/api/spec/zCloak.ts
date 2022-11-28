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
        Class: 'Vec<u8>',
        TaskStatus: {
          _enum: [
            'JustCreated',
            'Verifying',
            'VerifiedTrue',
            'VerifiedFalse'
          ]
        },
        Status: {
          verifiers: 'Vec<u32>',
          ayes: 'u32',
          nays: 'u32'
        },
        VerificationReceipt: {
          program_hash: '[u8; 32]',
          passed: 'bool',
          submit_at: 'BlockNumber',
          auth_index: 'u32',
          validator_len: 'u32'
        },
        TaskInfo: {
          proof_id: 'Vec<u8>',
          inputs: 'Vec<u128>',
          outputs: 'Vec<u128>',
          program_hash: '[u8; 32]',
          is_task_finish: 'Option<TaskStatus>',
          expiration: 'Option<BlockNumber>'
        }
      }
    }
  ]
};

export default definitions;
