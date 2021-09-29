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
        AccountInfo: 'AccountInfoWithDualRefCount',
        SubGameAssetMetadata: {
          deposit: 'DepositBalance',
          name: 'Vec<u8>',
          symbol: 'Vec<u8>',
          decimals: 'u8'
        },
        SubGameAssetDetails: {
          owner: 'AccountId',
          issuer: 'AccountId',
          admin: 'AccountId',
          freezer: 'AccountId',
          supply: 'u64',
          deposit: 'DepositBalance',
          max_zombies: 'u32',
          min_balance: 'u64',
          zombies: 'u32',
          accounts: 'u32',
          isFrozen: 'bool'
        },
        SusGameAssetBalance: {
          balance: 'u64',
          isFrozen: 'bool',
          isZombie: 'bool'
        },
        SGAssetBalance: 'u64',
        CommodityId: 'Hash',
        Commodity: {
          id: 'CommodityId',
          info: 'Vec<u8>'
        },
        ProgramId: 'u64',
        Program: {
          program_id: 'ProgramId',
          stake_amount: 'u128',
          valid_day_count: 'u64'
        },
        PalletId: 'u64',
        PalletInfo: {
          pallet_id: 'PalletId',
          name: 'Vec<u8>'
        },
        NftId: 'Hash',
        LeaseInfo: {
          pallet_id: 'PalletId',
          nft_id: 'NftId'
        },
        StakeInfo: {
          pallet_id: 'PalletId',
          program_id: 'ProgramId',
          stake_amount: 'Balance',
          expires_at: 'Moment',
          nft_id: 'NftId'
        },
        Moment: 'u64',
        MomentOf: 'Moment',
        SwapId: 'u32',
        SwapSender: 'AccountId',
        SwapPoolOwner: 'AccountId',
        SwapAssetX: 'u32',
        SwapAssetY: 'u32',
        SwapAmountX: 'u64',
        SwapAmountY: 'u64',
        SwapAmountLP: 'u64',
        SwapPoolDetails: {
          swap_id: 'u32',
          account: 'AccountId',
          asset_a: 'u32',
          asset_b: 'u32',
          asset_lp: 'u32',
          swap_k: 'u128'
        }
      }
    }
  ]
};

export default definitions;
