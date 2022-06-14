// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

export default {
  AccountInfo: 'AccountInfoWithProviders',
  Address: 'AccountId',
  AddressInfo: 'Vec<u8>',
  LookupSource: 'AccountId',
  EraBenefits: {
    total_benefits: 'Balance',
    total_funds: 'Balance',
    used_benefits: 'Balance',
    active_era: 'EraIndex'
  },
  FeeReductionBenefit: {
    funds: 'Balance',
    total_fee_reduction_count: 'u32',
    used_fee_reduction_quota: 'Balance',
    used_fee_reduction_count: 'u32',
    refreshed_at: 'EraIndex'
  },
  CsmBalance: 'Balance',
  CsmBalanceOf: 'Balance',
  ETHAddress: 'Vec<u8>',
  EthereumTxHash: 'H256',
  CSMLedger: {
    total: 'Compact<Balance>',
    active: 'Compact<Balance>',
    unlocking: 'Vec<CSMUnlockChunk<Balance>>'
  },
  CSMUnlockChunk: {
    value: 'Compact<Balance>',
    bn: 'Compact<BlockNumber>'
  },
  FileInfo: {
    file_size: 'u64',
    expired_on: 'BlockNumber',
    calculated_at: 'BlockNumber',
    amount: 'Balance',
    prepaid: 'Balance',
    reported_replica_count: 'u32',
    replicas: 'Vec<Replica<AccountId>>'
  },
  MerchantLedger: {
    reward: 'Balance',
    collateral: 'Balance'
  },
  Releases: {
    _enum: ['V1_0_0', 'V2_0_0']
  },
  Replica: {
    who: 'AccountId',
    valid_at: 'BlockNumber',
    anchor: 'SworkerAnchor',
    is_reported: 'bool'
  },
  Status: {
    _enum: ['Free', 'Reserved']
  },
  UsedInfo: {
    used_size: 'u64',
    reported_group_count: 'u32',
    groups: 'BTreeMap<SworkerAnchor, bool>'
  },
  Guarantee: {
    targets: 'Vec<IndividualExposure<AccountId, Balance>>',
    total: 'Compact<Balance>',
    submitted_in: 'EraIndex',
    suppressed: 'bool'
  },
  ValidatorPrefs: {
    guarantee_fee: 'Compact<Perbill>'
  },
  IASSig: 'Vec<u8>',
  Identity: {
    anchor: 'SworkerAnchor',
    punishment_deadline: 'u64',
    group: 'Option<AccountId>'
  },
  ISVBody: 'Vec<u8>',
  MerkleRoot: 'Vec<u8>',
  ReportSlot: 'u64',
  PKInfo: {
    code: 'SworkerCode',
    anchor: 'Option<SworkerAnchor>'
  },
  SworkerAnchor: 'Vec<u8>',
  SworkerCert: 'Vec<u8>',
  SworkerCode: 'Vec<u8>',
  SworkerPubKey: 'Vec<u8>',
  SworkerSignature: 'Vec<u8>',
  WorkReport: {
    report_slot: 'u64',
    used: 'u64',
    free: 'u64',
    reported_files_size: 'u64',
    reported_srd_root: 'MerkleRoot',
    reported_files_root: 'MerkleRoot'
  }
};
