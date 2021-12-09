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
        Address: 'MultiAddress',
        LookupSource: 'MultiAddress',
        BalanceOf: 'Balance',
        FractionLength: 'u32',
        RequestInterval: 'u8',
        JsonNumberValue: {
          integer: 'u64',
          fraction: 'u64',
          fraction_length: 'u32',
          exponent: 'u32'
        },
        PricePayloadSubPrice: '(Bytes, u64, FractionLength, JsonNumberValue)',
        PricePayloadSubJumpBlock: '(Bytes, RequestInterval)',
        PricePayload: {
          block_number: 'BlockNumber',
          price: 'Vec<PricePayloadSubPrice>',
          jump_block: 'Vec<PricePayloadSubJumpBlock>',
          public: 'AccountId'
        },
        PurchasedRequestData: {
          account_id: 'AccountId',
          offer: 'BalanceOf',
          create_bn: 'BlockNumber',
          submit_threshold: 'u8',
          max_duration: 'u64',
          request_keys: 'Vec<Vec<u8>>'
        },
        PurchasedPricePayload: {
          block_number: 'BlockNumber',
          purchase_id: 'Vec<u8>',
          price: 'Vec<PricePayloadSubPrice>',
          public: 'AccountId'
        },
        PurchasedAvgPriceData: {
          create_bn: 'u64',
          reached_type: 'u8',
          price_data: '(u64, FractionLength)'
        },
        PurchasedDefaultData: {
          submit_threshold: 'u8',
          max_duration: 'u64',
          avg_keep_duration: 'u64',
          unit_price: 'u64'
        },
        PurchasedForceCleanPayload: {
          BlockNumber: 'BlockNumber',
          purchase_id_list: 'Vec<Vec<u8>>',
          public: 'AccountId'
        },
        OcwControlData: {
          need_verifier_check: 'bool',
          open_free_price_reporter: 'bool',
          open_paid_price_reporter: 'bool'
        },
        AskPeriodNum: 'u64',
        PurchaseId: 'Vec<u8>',
        AskPointNum: 'u32',
        PaidValue: {
          create_bn: 'BlockNumber',
          amount: 'BalanceOf',
          is_income: 'bool'
        },
        // estimates price
        SymbolEstimatesConfig: {
          symbol: 'Bytes',
          id: 'u64',
          price: 'Balance',
          start: 'BlockNumber',
          length: 'BlockNumber',
          delay: 'BlockNumber',
          deviation: 'Permill',
          state: 'EstimatesState',
          total_reward: 'Balance'
        },
        EstimatesState: {
          _enum: [
            'InActive',
            'Active',
            'WaitingPayout',
            'Completed'
          ]
        },
        AccountParticipateEstimates: {
          account: 'AccountId',
          estimates: 'u64',
          eth_address: 'Option<Bytes>'
        },
        ChooseWinnersPayload: {
          block_number: 'BlockNumber',
          winners: 'Vec<AccountParticipateEstimates>',
          public: 'AccountId',
          estimates_config: 'Bytes',
          symbol: 'Bytes',
          price: '(u64, FractionLength)'
        }
      }
    }
  ]
};

export default definitions;
