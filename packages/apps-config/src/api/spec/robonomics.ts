// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable sort-keys */

export default {
  RefCount: 'u8',
  Record: 'Vec<u8>',
  TechnicalParam: 'Vec<u8>',
  TechnicalReport: 'Vec<u8>',
  EconomicalParam: '{}',
  ProofParam: 'MultiSignature',
  LiabilityIndex: 'u64',
  ValidationFunctionParams: {
    max_code_size: 'u32',
    relay_chain_height: 'u32',
    code_upgrade_allowed: 'Option<u32>'
  }
};
