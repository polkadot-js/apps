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
        Keys: 'SessionKeys2',
        Address: 'MultiAddress',
        LookupSource: 'MultiAddress',
        AccountData: {
          free: 'Balance',
          reserved: 'Balance',
          misc_frozen: 'Balance',
          fee_frozen: 'Balance'
        },
        AccountInfo: 'AccountInfoWithDualRefCount',
        WorkId: 'u32',
        Id: 'u32',
        Name: 'Vec<u8>',
        Value: 'Vec<u8>',
        ReasonIndex: 'u32',
        LottoIndex: 'u32',
        MemberId: 'u64',
        ProposalId: 'u64',
        TokenBalance: 'Balance',
        LotteryKind: {
          _enum: [
            'Routine',
            'TreasuryFunded(ReasonIndex)'
          ]
        },
        LottoResult: {
          _enum: [
            'Routine(AccountId, Balance)',
            'TreasuryFunded(Balance)'
          ]
        },
        Lottery: {
          round: 'LottoIndex',
          kind: 'LotteryKind',
          jackpot: 'Balance',
          next_ticket_id: 'u32',
          players: 'BTreeMap<AccountId, bool>',
          tickets: 'BTreeMap<u32, AccountId>',
          result: 'Option<LottoResult<AccountId, Balance>>'
        },
        CurrencyId: {
          _enum: {
            Native: 'Null',
            UINK: 'Null',
            DOT: 'Null',
            KSM: 'Null',
            ETH: 'Null',
            Token: 'TokenSymbol'
          }
        },
        TokenSymbol: {
          _enum: [
            'USDT',
            'DAI'
          ]
        },
        StorageVersion: {
          _enum: [
            'V1_0_0',
            'V2_0_0'
          ]
        },
        CurrencyIdOf: 'CurrencyId',
        Amount: 'i128',
        AmountOf: 'Amount',
        NameData: {
          value: 'Value',
          owner: 'AccountId',
          expiration: 'Option<u32>'
        },
        Token: {
          hash: 'H256',
          symbol: 'Vec<u8>',
          total_supply: 'Balance'
        },
        OrderType: {
          _enum: [
            'Buy',
            'Sell'
          ]
        },
        OrderStatus: {
          _enum: [
            'Created',
            'PartialFilled',
            'Filled',
            'Canceled'
          ]
        },
        TradePair: {
          hash: 'H256',
          base: 'H256',
          quote: 'H256',
          buy_one_price: 'Option<Price>',
          sell_one_price: 'Option<Price>',
          latest_matched_price: 'Option<Price>',
          one_day_trade_volume: 'Option<Price>',
          one_day_highest_price: 'Option<Price>',
          one_day_lowest_price: 'Option<Price>'
        },
        Price: 'u128',
        LimitOrder: {
          hash: 'H256',
          base: 'H256',
          quote: 'H256',
          owner: 'AccountId',
          price: 'Price',
          sell_amount: 'Balance',
          buy_amount: 'Balance',
          remained_sell_amount: 'Balance',
          remained_buy_amount: 'Balance',
          otype: 'OrderType',
          status: 'OrderStatus'
        },
        Trade: {
          hash: 'H256',
          base: 'H256',
          quote: 'H256',
          buyer: 'AccountId',
          seller: 'AccountId',
          maker: 'AccountId',
          taker: 'AccountId',
          otype: 'OrderType',
          price: 'Price',
          base_amount: 'Balance',
          quote_amount: 'Balance'
        },
        OrderLinkedItem: {
          prev: 'Option<Price>',
          next: 'Option<Price>',
          price: 'Option<Price>',
          orders: 'Vec<H256>'
        },
        CollectionMode: {
          _enum: {
            Invalid: null,
            NFT: 'u32',
            Fungible: 'u32',
            ReFungible: '(u32, u32)'
          }
        },
        NftItemType: {
          Collection: 'u64',
          Owner: 'AccountId',
          Data: 'Vec<u8>',
          item_hash: 'H160'
        },
        FungibleItemType: {
          Collection: 'u64',
          Owner: 'AccountId',
          value: 'u128',
          item_hash: 'H160'
        },
        ApprovePermissions: {
          approved: 'AccountId',
          amount: 'u64'
        },
        AccessMode: {
          _enum: [
            'Normal',
            'WhiteList'
          ]
        },
        SaleOrder: {
          order_id: 'u64',
          collection_id: 'u64',
          item_id: 'u64',
          currency_id: 'CurrencyId',
          value: 'u64',
          owner: 'AccountId',
          price: 'u64'
        },
        SplitSaleOrder: {
          order_id: 'u64',
          collection_id: 'u64',
          item_id: 'u64',
          currency_id: 'CurrencyId',
          value: 'u64',
          balance: 'u64',
          owner: 'AccountId',
          price: 'u64'
        },
        SaleOrderHistory: {
          collection_id: 'u64',
          item_id: 'u64',
          currency_id: 'CurrencyId',
          value: 'u64',
          seller: 'AccountId',
          buyer: 'AccountId',
          price: 'u64',
          buy_time: 'BlockNumber'
        },
        SignatureAuthentication: {
          collection: 'u64',
          item: 'u64',
          names: 'Name',
          names_owner: 'AccountId',
          sign_time: 'BlockNumber',
          memo: 'Vec<u8>',
          expiration: 'Option<BlockNumber>'
        },
        Ownership: {
          owner: 'AccountId',
          fraction: 'u128'
        },
        ReFungibleItemType: {
          Collection: 'u64',
          Owner: 'Vec<Ownership<AccountId>>',
          Data: 'Vec<u8>',
          item_hash: 'H160'
        },
        CollectionType: {
          Owner: 'AccountId',
          Mode: 'CollectionMode',
          Access: 'u8',
          DecimalPoints: 'u32',
          Name: 'Vec<u16>',
          Description: 'Vec<u16>',
          TokenPrefix: 'Vec<u8>',
          CustomDataSize: 'u32',
          OffchainSchema: 'Vec<u8>',
          Sponsor: 'AccountId',
          UnconfirmedSponsor: 'AccountId'
        },
        Auction: {
          id: 'u64',
          collection_id: 'u64',
          item_id: 'u64',
          currency_id: 'CurrencyId',
          value: 'u64',
          owner: 'AccountId',
          start_price: 'u64',
          increment: 'u64',
          current_price: 'u64',
          start_time: 'BlockNumber',
          end_time: 'BlockNumber'
        },
        BidHistory: {
          auction_id: 'u64',
          currency_id: 'CurrencyId',
          bidder: 'AccountId',
          bid_price: 'u64',
          bid_time: 'BlockNumber'
        },
        Pool: {
          id: 'Id',
          account: 'AccountId',
          acc_rewards_per_share: 'Balance',
          last_reward_block: 'BlockNumber',
          asset_id: 'Id',
          total_balance: 'Balance'
        },
        Staker: {
          amount: 'Balance',
          reward: 'Balance',
          debt: 'Balance'
        },
        Limits: {
          max_tx_value: 'u128',
          day_max_limit: 'u128',
          day_max_limit_for_one_address: 'u128',
          max_pending_tx_limit: 'u128',
          min_tx_value: 'u128'
        },
        Royalty: {
          owner: 'AccountId',
          rate: 'u64',
          expired_at: 'BlockNumber'
        },
        NftCard: {
          group_id: 'u64',
          collection_id: 'u64',
          item_id: 'u64',
          value: 'u64',
          remaind_value: 'u64',
          draw_start: 'u64',
          draw_end: 'u64'
        },
        BlindboxItem: {
          id: 'u64',
          owner: 'AccountId',
          card_group: 'Vec<u64>',
          total_count: 'u64',
          remaind_count: 'u64',
          currency_id: 'CurrencyId',
          price: 'u64',
          start_time: 'BlockNumber',
          end_time: 'BlockNumber',
          has_ended: 'bool'
        }
      }
    }
  ]
};

export default definitions;
