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
        AccountInfo: 'AccountInfoWithRefCount',
        Address: 'MultiAddress',
        LookupSource: 'MultiAddress',
        Token: {
          symbol: 'Vec<u8>',
          precision: 'u16',
          total_supply: 'Balance',
          token_type: 'TokenType',
          pair: 'Option<AssetId>'
        },
        Price: 'u64',
        AccountAsset: {
          balance: 'Balance',
          locked: 'Balance',
          available: 'Balance',
          cost: 'Balance',
          income: 'Balance'
        },
        TokenSymbol: {
          _enum: [
            'BNC',
            'aUSD',
            'DOT',
            'vDOT',
            'KSM',
            'vKSM',
            'ETH',
            'vETH',
            'EOS',
            'vEOS',
            'IOST',
            'vIOST'
          ]
        },
        TokenType: {
          _enum: [
            'Native',
            'Stable',
            'Token',
            'VToken'
          ]
        },
        CurrencyId: {
          _enum: {
            Token: 'TokenSymbol'
          }
        },
        BiddingOrderId: 'u64',
        RewardRecord: {
          account_id: 'AccountId',
          record_amount: 'Balance'
        },
        EraId: 'u32',
        BiddingOrderUnit: {
          bidder_id: 'AccountId',
          token_id: 'AssetId',
          block_num: 'BlockNumber',
          votes: 'Balance',
          annual_roi: 'Permill',
          validator: 'AccountId'
        },
        BiddingOrderUnitOf: 'BiddingOrderUnit',
        VersionId: 'u32',
        PermissionName: 'u64',
        PermissionLevel: {
          actor: 'AccountName',
          permission: 'PermissionName'
        },
        Action: {
          account: 'AccountName',
          name: 'ActionName',
          authorization: 'Vec<PermissionLevel>',
          data: 'Vec<u8>'
        },
        AccountName: 'u64',
        Checksum256: '([u8;32])',
        ActionName: 'u64',
        FlatMap: {
          map: 'Vec<(ActionName, u64)>'
        },
        UnsignedInt: 'u32',
        ActionReceipt: {
          receiver: 'AccountName',
          act_digest: 'Checksum256',
          global_sequence: 'u64',
          recv_sequence: 'u64',
          auth_sequence: 'FlatMap<AccountName, u64>',
          code_sequence: 'UnsignedInt',
          abi_sequence: 'UnsignedInt'
        },
        BlockchainType: {
          _enum: [
            'BIFROST',
            'EOS',
            'IOST'
          ]
        },
        Precision: 'u32',
        BridgeAssetSymbol: {
          blockchain: 'BlockchainType',
          symbol: 'Vec<u8>',
          precision: 'Precision'
        },
        PublicKey: {
          type_: 'UnsignedInt',
          data: '[u8;33]'
        },
        ProducerKey: {
          producer_name: 'AccountName',
          block_signing_key: 'PublicKey'
        },
        ProducerSchedule: {
          version: 'u32',
          producers: 'Vec<ProducerKey>'
        },
        bridgeEosSignature: {
          type_: 'UnsignedInt',
          data: '[u8;65]'
        },
        BlockTimestamp: '(u32)',
        Extension: '(u16, Vec<u8>)',
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
        SignedBlockHeader: {
          block_header: 'BlockHeader',
          producer_signature: 'bridgeEosSignature'
        },
        Checksum256Array: 'Vec<Checksum256>',
        IncrementalMerkle: {
          _node_count: 'u64',
          _active_nodes: 'Checksum256Array'
        },
        TxSig: {
          signature: 'Vec<u8>',
          author: 'AccountId'
        },
        MultiSig: {
          signatures: 'Vec<TxSig>',
          threshold: 'u8'
        },
        MultiSigTx: {
          chain_id: 'Vec<u8>',
          raw_tx: 'Vec<u8>',
          multi_sig: 'MultiSig',
          action: 'Action',
          from: 'AccountId',
          asset_id: 'AssetId'
        },
        Sent: {
          tx_id: 'Vec<u8>',
          from: 'AccountId',
          asset_id: 'AssetId'
        },
        Succeeded: {
          tx_id: 'Vec<u8>'
        },
        Failed: {
          tx_id: 'Vec<u8>',
          reason: 'Vec<u8>'
        },
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
        ProducerAuthoritySchedule: {
          version: 'u32',
          producers: 'Vec<ProducerAuthority>'
        },
        ProducerAuthority: {
          producer_name: 'ActionName',
          authority: 'BlockSigningAuthority'
        },
        BlockSigningAuthority: '(UnsignedInt, BlockSigningAuthorityV0)',
        BlockSigningAuthorityV0: {
          threshold: 'u32',
          keyWeights: 'Vec<KeyWeight>'
        },
        KeyWeight: {
          key: 'PublicKey',
          weight: 'u16'
        },
        IostAction: {
          contract: 'Vec<u8>',
          action_name: 'Vec<u8>',
          data: 'Vec<u8>'
        },
        IostMultiSigTx: {
          chain_id: 'i32',
          raw_tx: 'Vec<u8>',
          multi_sig: 'MultiSig',
          action: 'IostAction',
          from: 'AccountId',
          asset_id: 'AssetId'
        },
        Processing: {
          tx_id: 'Vec<u8>',
          multi_sig_tx: 'IostMultiSigTx'
        },
        IostTxOut: {
          _enum: {
            Initial: 'IostMultiSigTx',
            Generated: 'IostMultiSigTx',
            Signed: 'IostMultiSigTx',
            Processing: 'Processing',
            Success: 'Vec<u8>',
            Fail: 'Failed'
          }
        },
        SpecIndex: 'u32',
        RequestIdentifier: 'u64',
        DataVersion: 'u64',
        AssetConfig: {
          redeem_duration: 'BlockNumber',
          min_reward_per_block: 'Balance'
        },
        ProxyValidatorRegister: {
          last_block: 'BlockNumber',
          deposit: 'Balance',
          need: 'Balance',
          staking: 'Balance',
          reward_per_block: 'Balance',
          validator_address: 'Vec<u8>'
        },
        PoolId: 'u32',
        SwapFee: 'u128',
        PoolDetails: {
          owner: 'AccountId',
          swap_fee_rate: 'SwapFee',
          active: 'bool'
        },
        PoolWeight: 'Balance',
        PoolToken: 'u128',
        PoolCreateTokenDetails: {
          token_id: 'AssetId',
          token_balance: 'Balance',
          token_weight: 'PoolWeight'
        },
        VtokenPool: {
          token_pool: 'Balance',
          vtoken_pool: 'Balance',
          current_reward: 'Balance',
          pending_reward: 'Balance'
        },
        VtokenMintPrice: 'u128',
        MintPrice: 'VtokenMintPrice',
        CurrencyIdOf: 'CurrencyId'
      }

    }
  ]
};

export default definitions;
