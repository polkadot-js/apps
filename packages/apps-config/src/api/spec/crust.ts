// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

export default {
  Address: 'AccountId',
  RefCount: 'u8',
  AddressInfo: 'Vec<u8>',
  FileAlias: 'Vec<u8>',
  Guarantee: {
    targets: 'Vec<IndividualExposure<AccountId, Balance>>',
    total: 'Compact<Balance>',
    submitted_in: 'EraIndex',
    suppressed: 'bool'
  },
  IASSig: 'Vec<u8>',
  Identity: {
    pub_key: 'Vec<u8>',
    code: 'Vec<u8>'
  },
  ISVBody: 'Vec<u8>',
  LookupSource: 'AccountId',
  MerchantInfo: {
    address: 'Vec<u8>',
    storage_price: 'Balance',
    file_map: 'Vec<(Vec<u8>, Vec<Hash>)>'
  },
  MerchantPunishment: {
    success: 'EraIndex',
    failed: 'EraIndex',
    value: 'Balance'
  },
  MerkleRoot: 'Vec<u8>',
  OrderStatus: {
    _enum: ['Success', 'Failed', 'Pending']
  },
  PaymentLedger: {
    total: 'Balance',
    paid: 'Balance',
    unreserved: 'Balance'
  },
  Pledge: {
    total: 'Balance',
    used: 'Balance'
  },
  ReportSlot: 'u64',
  Releases: {
    _enum: ['V1_0_0', 'V2_0_0']
  },
  Status: {
    _enum: ['Free', 'Reserved']
  },
  StorageOrder: {
    file_identifier: 'Vec<u8>',
    file_size: 'u64',
    created_on: 'BlockNumber',
    completed_on: 'BlockNumber',
    expired_on: 'BlockNumber',
    provider: 'AccountId',
    client: 'AccountId',
    amount: 'Balance',
    order_status: 'OrderStatus'
  },
  SworkerCert: 'Vec<u8>',
  SworkerCode: 'Vec<u8>',
  SworkerPubKey: 'Vec<u8>',
  SworkerSignature: 'Vec<u8>',
  WorkReport: {
    block_number: 'u64',
    used: 'u64',
    reserved: 'u64',
    cached_reserved: 'u64',
    files: 'Vec<(Vec<u8>, u64)>'
  }
};
