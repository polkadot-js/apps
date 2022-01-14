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
        Contribution: {
          account_id: 'AccountId',
          value: 'Balance'
        },
        Grant: {
          contributions: 'Vec<Contribution>',
          is_approved: 'bool',
          is_canceled: 'bool',
          is_withdrawn: 'bool',
          matching_fund: 'Balance',
          project_index: 'ProjectIndex',
          withdrawal_expiration: 'BlockNumber'
        },
        Project: {
          create_block_number: 'BlockNumber',
          description: 'Vec<u8>',
          logo: 'Vec<u8>',
          name: 'Vec<u8>',
          owner: 'AccountId',
          website: 'Vec<u8>'
        },
        ProjectIndex: 'u32',
        ProjectOf: 'Project',
        Round: {
          end: 'BlockNumber',
          grants: 'Vec<Grant>',
          is_canceled: 'bool',
          is_finalized: 'bool',
          matching_fund: 'Balance',
          start: 'BlockNumber'
        },
        RoundIndex: 'u32',
        RoundOf: 'Round'
      }
    }
  ]
};

export default definitions;
