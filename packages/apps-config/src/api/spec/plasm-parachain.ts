// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

export default {
  Address: 'MultiAddress',
  LookupSource: 'MultiAddress',
  ValidationDataType: {
    validation_data: 'ValidationData',
    relay_chain_state: 'Vec<Bytes>'
  },
  PersistedValidationData: {
    parent_head: 'Bytes',
    block_number: 'u32',
    relay_storage_root: 'Hash',
    hrmp_mqc_heads: 'Vec<(u32, Hash)>',
    dmq_mqc_head: 'Hash',
    max_pov_size: 'u32'
  }
};
