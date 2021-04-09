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
        Token: { symbol: 'Vec<u8>', precision: 'u16', totalSupply: 'u128' },
        VersionId: 'u32',
        Action: {
          account: 'AccountName',
          name: 'ActionName',
          authorization: 'Vec<PermissionLevel>',
          data: 'Vec<u8>'
        },
        IostAction: { contract: 'Vec<u8>', action_name: 'Vec<u8>', data: 'Vec<u8>' },
        PermissionLevel: { actor: 'AccountName', permission: 'PermissionName' },
        PermissionName: 'u64',
        ActionReceipt: {
          receiver: 'AccountName',
          act_digest: 'Checksum256',
          global_sequence: 'u64',
          recv_sequence: 'u64',
          auth_sequence: 'FlatMap<AccountName, u64>',
          code_sequence: 'UnsignedInt',
          abi_sequence: 'UnsignedInt'
        },
        Checksum256: '([u8;32])',
        BlockchainType: { _enum: ['BIFROST', 'EOS', 'IOST'] },
        Precision: 'u32',
        BridgeAssetSymbol: {
          blockchain: 'BlockchainType',
          symbol: 'Vec<u8>',
          precision: 'Precision'
        },
        ProducerSchedule: { version: 'u32', producers: 'Vec<ProducerKey>' },
        ProducerKey: { producer_name: 'AccountName', block_signing_key: 'PublicKey' },
        AccountName: 'u64',
        ActionName: 'u64',
        PublicKey: { type_: 'UnsignedInt', data: '[u8;33]' },
        UnsignedInt: 'u32',
        Signature: { type_: 'UnsignedInt', data: '[u8;65]' },
        SignedBlockHeader: { block_header: 'BlockHeader', producer_signature: 'Signature' },
        BlockHeader: {
          timestamp: 'BlockTimestamp',
          producer: 'AccountName',
          confirmed: 'u16',
          previous: 'Checksum256',
          transaction_mroot: 'Checksum256',
          action_mroot: 'Checksum256',
          schedule_version: 'u32',
          new_producers: 'Option<ProducerSchedule>',
          header_extensions: 'Vec<Extension>'
        },
        BlockTimestamp: '(u32)',
        Extension: '(u16, Vec<u8>)',
        IncrementalMerkle: { _node_count: 'u64', _active_nodes: 'Checksum256Array' },
        Checksum256Array: 'Vec<Checksum256>',
        FlatMap: { map: 'Vec<(ActionName, u64)>' },
        TxSig: { signature: 'Vec<u8>', author: 'AccountId' },
        MultiSig: { signatures: 'Vec<TxSig>', threshold: 'u8' },
        MultiSigTx: {
          chain_id: 'Vec<u8>',
          raw_tx: 'Vec<u8>',
          multi_sig: 'MultiSig',
          action: 'Action',
          from: 'AccountId',
          token_symbol: 'TokenSymbol'
        },
        Sent: { tx_id: 'Vec<u8>', from: 'AccountId', token_symbol: 'TokenSymbol' },
        Succeeded: { tx_id: 'Vec<u8>' },
        Failed: { tx_id: 'Vec<u8>', reason: 'Vec<u8>' },
        TxOut: {
          _enum: {
            Initialized: 'MultiSigTx',
            Created: 'MultiSigTx',
            SignComplete: 'MultiSigTx',
            Sent: 'Sent',
            Succeeded: 'Succeeded',
            Failed: 'Failed'
          }
        },
        RewardRecord: { account_id: 'AccountId', record_amount: 'Balance' },
        ConvertPrice: 'u128',
        RatePerBlock: 'u64',
        Fee: 'u64',
        PoolId: 'u32',
        Nonce: 'u32',
        PoolDetails: { owner: 'AccountId', swap_fee_rate: 'Fee', active: 'bool' },
        PoolCreateTokenDetails: {
          token_id: 'TokenSymbol',
          token_balance: 'Balance',
          token_weight: 'PoolWeight'
        },
        TokenPool: 'Balance',
        VTokenPool: 'Balance',
        InVariantPool: 'Balance',
        TokenSymbol: {
          _enum: [
            'aUSD', 'DOT',
            'vDOT', 'KSM',
            'vKSM', 'EOS',
            'vEOS', 'IOST',
            'vIOST'
          ]
        },
        TransactionStatus: {
          _enum: [
            'Initialized',
            'Created',
            'SignComplete',
            'Sent',
            'Succeeded',
            'Failed'
          ]
        },
        Cost: 'u128',
        Income: 'u128',
        Price: 'u64',
        AccountAsset: {
          balance: 'Balance',
          locked: 'Balance',
          available: 'Balance',
          cost: 'Cost',
          income: 'Income'
        },
        SpecIndex: 'u32',
        RequestIdentifier: 'u64',
        DataVersion: 'u64',
        ConvertPool: {
          token_pool: 'Balance',
          vtoken_pool: 'Balance',
          current_reward: 'Balance',
          pending_reward: 'Balance'
        },
        ProducerAuthoritySchedule: { version: 'u32', producers: 'Vec<ProducerAuthority>' },
        ProducerAuthority: { producer_name: 'ActionName', authority: 'BlockSigningAuthority' },
        BlockSigningAuthority: '(UnsignedInt, BlockSigningAuthorityV0)',
        BlockSigningAuthorityV0: { threshold: 'u32', keys: 'Vec<KeyWeight>' },
        KeyWeight: { key: 'PublicKey', weight: 'u16' },
        InvariantValue: 'Balance',
        PoolWeight: 'Balance',
        AssetConfig: { redeem_duration: 'BlockNumber', min_reward_per_block: 'Balance' },
        ProxyValidatorRegister: {
          last_block: 'BlockNumber',
          deposit: 'Balance',
          need: 'Balance',
          staking: 'Balance',
          reward_per_block: 'Balance',
          validator_address: 'Vec<u8>'
        },
        BlockNumber: 'u32'
      }
    }
  ]
};

export default definitions;
