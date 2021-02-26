// Copyright 2017-2021 @polkadot/apps-config authors & contributors
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
        Address: 'AccountId',
        AddressInfo: 'Vec<u8>',
        ETHAddress: 'Vec<u8>',
        EthereumTxHash: 'H256',
        FileAlias: 'Vec<u8>',
        FileInfo: {
          file_size: 'u64',
          expired_on: 'BlockNumber',
          claimed_at: 'BlockNumber',
          amount: 'Balance',
          expected_replica_count: 'u32',
          reported_replica_count: 'u32',
          replicas: 'Vec<Replica<AccountId>>'
        },
        Guarantee: {
          targets: 'Vec<IndividualExposure<AccountId, Balance>>',
          total: 'Compact<Balance>',
          submitted_in: 'EraIndex',
          suppressed: 'bool'
        },
        IASSig: 'Vec<u8>',
        Identity: {
          anchor: 'SworkerAnchor',
          punishment_deadline: 'u64',
          group: 'Option<AccountId>'
        },
        ISVBody: 'Vec<u8>',
        LookupSource: 'AccountId',
        MerchantLedger: {
          reward: 'Balance',
          pledge: 'Balance'
        },
        MerkleRoot: 'Vec<u8>',
        ReportSlot: 'u64',
        Replica: {
          who: 'AccountId',
          valid_at: 'BlockNumber',
          anchor: 'SworkerAnchor',
          is_reported: 'bool'
        },
        PKInfo: {
          code: 'SworkerCode',
          anchor: 'Option<SworkerAnchor>'
        },
        Status: {
          _enum: ['Free', 'Reserved']
        },
        SworkerAnchor: 'Vec<u8>',
        SworkerCert: 'Vec<u8>',
        SworkerCode: 'Vec<u8>',
        SworkerPubKey: 'Vec<u8>',
        SworkerSignature: 'Vec<u8>',
        UsedInfo: {
          used_size: 'u64',
          reported_group_count: 'u32',
          groups: 'BTreeMap<SworkerAnchor, bool>'
        },
        WorkReport: {
          report_slot: 'u64',
          used: 'u64',
          free: 'u64',
          reported_files_size: 'u64',
          reported_srd_root: 'MerkleRoot',
          reported_files_root: 'MerkleRoot'
        }
      }
    }
  ]
};

export default definitions;
