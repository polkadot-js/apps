// Copyright 2017-2025 @polkadot/apps-config authors & contributors
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
          game_mode: 'u8'
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
          will_expire: 'bool',
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
        },
        Auction: {
          id: 'u128',
          platform_id: 'u128',
          nft_id: 'NftId',
          seller: 'AccountId',
          buyer: 'Option<AccountId>',
          amount: 'Balance',
          percentage_of_fee: 'u8',
          platform_fee: 'Balance'
        },
        Platform: {
          id: 'u128',
          admin: 'AccountId',
          percentage_of_fee: 'u8',
          fee_account: 'AccountId'
        },
        Plan: {
          amount: 'SGAssetBalance',
          score: 'SGAssetBalance'
        },
        GRPlatform: {
          id: 'u128',
          admin: 'AccountId',
          pool_account: 'AccountId',
          asset_id: 'u32',
          plan: 'Vec<Plan>'
        },
        AbilityOfLevel: {
          level: 'u8',
          ability_value_1_min: 'u32',
          ability_value_1_max: 'u32'
        },
        CardType: {
          admin: 'AccountId',
          id: 'u128',
          name: 'Vec<u8>',
          desc: 'Vec<u8>',
          fixed_ability_value_1: 'u32',
          fixed_ability_value_2: 'u32',
          special_attribute_1: 'Vec<u8>',
          level_max_limit: 'u32',
          ability_of_level: 'Vec<AbilityOfLevel>',
          is_can_draw: 'bool'
        },
        CardInfo: {
          id: 'u128',
          name: 'Vec<u8>',
          desc: 'Vec<u8>',
          type_id: 'u128'
        },
        Card: {
          id: 'u128',
          card_info_id: 'u128',
          level: 'u8',
          ability_value_1: 'u32',
          nft_id: 'NftId'
        }
      }
    }
  ]
};

export default definitions;
