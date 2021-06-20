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
        GameIndex: 'u32',
        GameMode: 'u8',
        CommodityId: 'u128',
        CommodityInfo: 'Vec<u8>',
        CommodityLimit: 'u128',
        UserCommodityLimit: 'u64',
        ChipBalance: 'u128',
        ChipsDetail: {
          balance: 'u128',
          reserve: 'u128'
        },
        GameInfo: {
          owner: 'AccountId',
          block_number: 'u32',
          bet_block_number: 'u32',
          amount: 'u128'
        },
        BetInfo: {
          user: 'AccountId',
          game_id: 'u32',
          amount: 'u128',
          game_mode: 'u8' // 1 = odd , 2 = even
        },
        Template: {
          template_id: 'u32',
          template_name: 'Vec<u8>'
        },
        GameInstance: {
          game_instance_id: 'u32',
          owner: 'AccountId',
          bet_block_number: 'u32',
          chips_pool: 'u128',
          game_over: 'bool'
        },
        GameInstanceId: 'u32',
        AccountInfo: 'AccountInfoWithDualRefCount'
      }
    }
  ]
};

export default definitions;
