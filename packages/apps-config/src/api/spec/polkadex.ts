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
        OrderType: {
          _enum: [
            'BidLimit',
            'BidMarket',
            'AskLimit',
            'AskMarket'
          ]
        },
        Order: {
          id: 'Hash',
          trading_pair: 'Hash',
          trader: 'AccountId',
          price: 'FixedU128',
          quantity: 'FixedU128',
          order_type: 'OrderType'
        },
        Order4RPC: {
          id: '[u8;32]',
          trading_pair: '[u8;32]',
          trader: '[u8;32]',
          price: 'Vec<u8>',
          quantity: 'Vec<u8>',
          order_type: 'OrderType'
        },
        MarketData: {
          low: 'FixedU128',
          high: 'FixedU128',
          volume: 'FixedU128',
          open: 'FixedU128',
          close: 'FixedU128'

        },
        LinkedPriceLevel: {
          next: 'Option<FixedU128>',
          prev: 'Option<FixedU128>',
          orders: 'Vec<Order>'
        },
        LinkedPriceLevelRpc: {
          next: 'Vec<u8>',
          prev: 'Vec<u8>',
          orders: 'Vec<Order4RPC>'
        },
        Orderbook: {
          trading_pair: 'Hash',
          base_asset_id: 'u32',
          quote_asset_id: 'u32',
          best_bid_price: 'FixedU128',
          best_ask_price: 'FixedU128'
        },
        OrderbookRPC: {
          trading_pair: '[u8;32]',
          base_asset_id: 'u32',
          quote_asset_id: 'u32',
          best_bid_price: 'Vec<u8>',
          best_ask_price: 'Vec<u8>'
        },
        FrontendPricelevel: {
          price: 'FixedU128',
          quantity: 'FixedU128'
        },
        OrderbookUpdates: {
          bids: 'Vec<FrontendPricelevel>',
          asks: 'Vec<FrontendPricelevel>'
        },
        LookupSource: 'AccountId',
        Address: 'AccountId'
      }
    }
  ]
};

export default definitions;
