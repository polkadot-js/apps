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
        AskPeriodNum: 'u64',
        AskPointNum: 'u32',
        AuthorityAres: "AccountId",
        AccountParticipateEstimates: {
          account: 'AccountId',
          estimates: 'u64',
          eth_address: 'Option<Bytes>'
        },
        AresPriceData: {
          price: 'u64',
          account_id: 'AuthorityId',
          create_bn: 'BlockNumber',
          fraction_len: 'FractionLength',
          raw_number: 'JsonNumberValue',
          timestamp: 'u64',
        },
        BalanceOf: 'Balance',
        ChooseWinnersPayload: {
          block_number: 'BlockNumber',
          winners: 'Vec<AccountParticipateEstimates>',
          public: 'AccountId',
          estimates_config: 'Bytes',
          symbol: 'Bytes',
          price: '(u64, FractionLength)'
        },
        EstimatesState: {
          _enum: [
            'InActive',
            'Active',
            'WaitingPayout',
            'Completed'
          ]
        },
        FractionLength: 'u32',
        HttpError: {
          _enum: [
            'IoErr',
            'TimeOut',
            'StatusErr(u16)',
            'ParseErr'
          ]
        },
        LookupSource: 'MultiAddress',
        RequestInterval: 'u8',
        JsonNumberValue: {
          integer: 'u64',
          fraction: 'u64',
          fraction_length: 'u32',
          exponent: 'u32'
        },
        OcwControlData: {
          need_verifier_check: 'bool',
          open_free_price_reporter: 'bool',
          open_paid_price_reporter: 'bool'
        },
        OffchainSignature: 'MultiSignature',
        PaidValue: {
          create_bn: 'BlockNumber',
          amount: 'BalanceOf',
          is_income: 'bool'
        },
        PreCheckPayload: {
          pre_check_stash: 'AccountId',
          pre_check_auth: 'AuthorityId',
          auth: 'AuthorityId',
          block_number: 'BlockNumber',
          public: 'MultiSigner'
        },
        PreCheckResultPayload: {
          pre_check_stash: 'AccountId',
          pre_check_auth: 'AuthorityId',
          block_number: 'BlockNumber',
          pre_check_list: 'Vec<PreCheckStruct>',
          public: 'MultiSigner'
        },
        PreCheckCompareLog: {
          chain_avg_price_list: 'BTreeMap<Bytes, (u64, FractionLength)>',
          validator_up_price_list: 'BTreeMap<Bytes, (u64, FractionLength)>',
          raw_precheck_list: 'Vec<PreCheckStruct>'
        },
        PreCheckStruct: {
          price_key: 'Vec<u8>',
          number_val: 'JsonNumberValue',
          max_offset: 'Percent'
        },
        PricePayloadSubPrice: '(Bytes, u64, FractionLength, JsonNumberValue, u64)',
        PricePayloadSubJumpBlock: '(Bytes, RequestInterval)',
        PricePayload: {
          block_number: 'BlockNumber',
          price: 'Vec<PricePayloadSubPrice>',
          jump_block: 'Vec<PricePayloadSubJumpBlock>',
          auth: 'AuthorityId',
          public: 'MultiSigner'
        },
        HttpErrTracePayload: {
          trace_data: 'HttpErrTraceData<BlockNumber, AuthorityId>',
          auth: 'AuthorityId',
          public: 'MultiSigner'
        },
        HttpErrTraceData: {
          block_number: 'BlockNumber',
          err_auth: 'AuthorityId',
          err_status: 'HttpError',
          tip: 'Bytes',
        },
        PreCheckStatus: {
          _enum: [
            'Review',
            'Prohibit',
            'Pass'
          ]
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
          auth: 'AuthorityId',
          public: 'MultiSigner'
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
          auth: 'AuthorityId',
          public: 'MultiSigner'
        },
        PurchaseId: 'Vec<u8>',
        SymbolEstimatesConfig: {
          symbol: 'Bytes',
          id: 'u64',
          price: 'Balance',
          start: 'BlockNumber',
          length: 'BlockNumber',
          delay: 'BlockNumber',
          deviation: 'Permill',
          state: 'EstimatesState',
          total_reward: 'Balance',
        }
      }
    }
  ]
};

export default definitions;
