// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

export default {
  AccountData: {
    free: 'Balance',
    reserved: 'Balance',
    miscFrozen: 'Balance',
    feeFrozen: 'Balance',
    txCount: 'u32',
    sessionIndex: 'u32'
  },
  RefCount: 'u8',
  TemplateAccountData: {
    txCount: 'u32',
    sessionIndex: 'u32'
  },
  TxCount: 'u32'
};
