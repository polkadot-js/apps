// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
