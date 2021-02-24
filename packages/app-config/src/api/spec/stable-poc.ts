// Copyright 2017-2021 @polkadot/app-config authors & contributors
// and @canvas-ui/app-config authors & contributors
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
  TemplateAccountData: {
    txCount: 'u32',
    sessionIndex: 'u32'
  },
  TxCount: 'u32'
};
