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
        test: 'u64',
        Address: 'IndicesLookupSource',
        LookupSource: 'IndicesLookupSource',
        GIB: 'u64',
        Amount: 'u128',
        Miner: {
          account_id: 'AccountId',
          nickname: 'Vec<u8>',
          region: 'Vec<u8>',
          url: 'Vec<u8>',
          public_key: 'Vec<u8>',
          stash_address: 'AccountId',
          capacity: 'u128',
          unit_price: 'Balance',
          violation_times: 'u64',
          total_staking: 'Balance',
          create_ts: 'u64',
          update_ts: 'u64'
        },
        Order: {
          miner: 'AccountId',
          label: 'Vec<u8>',
          hash: '[u8; 46]',
          size: 'u128',
          user: 'AccountId',
          orders: 'Vec<MinerOrder<AccountId, Balance>>',
          status: 'OrderStatus',
          create_ts: 'u64',
          update_ts: 'u64',
          duration: 'u64'
        },
        MinerOrder: {
          miner: 'AccountId',
          day_price: 'Balance',
          total_price: 'Balance',
          verify_result: 'bool',
          verify_ts: 'u64',
          confirm_ts: 'u64',
          url: 'Option<Vec<u8>>'
        },
        OrderStatus: {
          _enum: [
            'Created',
            'Confirmed',
            'Expired',
            'Deleted'
          ]
        },
        MiningInfo: {
          miner: 'Option<AccountId>',
          best_dl: 'u64',
          block: 'u64'
        },
        Difficulty: {
          base_target: 'u64',
          net_difficulty: 'u64',
          block: 'u64'
        },
        MachineInfo: {
          plot_size: 'u64',
          numeric_id: 'u128',
          update_time: 'BlockNumber',
          is_stop: 'bool',
          reward_dest: 'AccountId'
        },
        StakingInfo: {
          miner: 'AccountId',
          miner_proportion: 'Percent',
          total_staking: 'Balance',
          others: 'Vec<(AccountId, Balance, Balance)>'
        },
        Oprate: {
          _enum: [
            'Add',
            'Sub'
          ]
        },
        MiningHistory: {
          total_num: 'u64',
          history: 'Vec<(BlockNumber, Balance)>'
        },
        PostTxTransferData: {
          verify_status: 'u64',
          irreversible: 'bool',
          is_post_transfer: 'bool',
          contract_account: 'Vec<u8>',
          from: 'Vec<u8>',
          to: 'Vec<u8>',
          quantity: 'u64',
          memo: 'Vec<u8>'
        },
        AddressStatus: {
          _enum: [
            'active',
            'inActive'
          ]
        },
        FetchFailedOf: {
          block_num: 'BlockNumber',
          tx: 'Vec<u8>',
          err: 'Vec<u8>'
        }
      }
    }
  ]
};

export default definitions;
