// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

export default {
  Address: 'AccountId',
  LookupSource: 'AccountId',
  RefCount: 'u8',
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
  TxCount: 'u32',
  Value: 'u128',
  UtxoHash: 'H256',
  AccountHash: 'H256',
  TxHash: 'H256',
  TransactionOutput: {
    value: 'Value',
    pubkey: 'AccountId'
  },
  SignedPair: {
    input: 'Vec<UtxoHash>',
    output: 'Vec<TransactionOutput>'
  },
  ArchivedTransaction: 'Vec<ArchivedPair>',
  ArchivedPair: {
    inputs: 'Vec<TransactionOutput>',
    outputs: 'Vec<UtxoHash>'
  }
};
