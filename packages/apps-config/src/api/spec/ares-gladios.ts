// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

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
        AuthorityAres: 'AccountId',
        AccountParticipateEstimates: {
          account: 'AccountId',
          end: 'BlockNumber',
          estimates: 'Option<u64>',
          range_index: 'Option<u8>',
          bsc_address: 'Option<Bytes>',
          multiplier: 'MultiplierOption',
          reward: 'u128'
        },
        AresPriceData: {
          price: 'u64',
          account_id: 'AccountId',
          create_bn: 'BlockNumber',
          fraction_len: 'FractionLength',
          raw_number: 'JsonNumberValue',
          timestamp: 'u64'
        },
        BalanceOf: 'Balance',
        ChooseWinnersPayload: {
          block_number: 'BlockNumber',
          winners: 'Vec<AccountParticipateEstimates>',
          public: 'AccountId',
          estimates_id: 'u64',
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
        EstimatesType: {
          _enum: [
            'DEVIATION', 'RANGE'
          ]
        },
        FractionLength: 'u32',
        HttpError: {
          _enum: {
            IoErr: 'Bytes',
            TimeOut: 'Bytes',
            StatusErr: '(Bytes,u16)',
            ParseErr: 'Bytes'
          }
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
          tip: 'Bytes'
        },
        JsonNumberValue: {
          integer: 'u64',
          fraction: 'u64',
          fraction_length: 'u32',
          exponent: 'u32'
        },
        Keys: 'SessionKeys3',
        LookupSource: 'MultiAddress',
        MultiplierOption: {
          _enum: [
            'Base1', 'Base2', 'Base5'
          ]
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
        PurchasedId: 'Bytes',
        PriceKey: 'Vec<u8>',
        PriceToken: 'Bytes',
        PreCheckPayload: {
          block_number: 'BlockNumber',
          pre_check_stash: 'AccountId',
          pre_check_auth: 'AuthorityId',
          auth: 'AuthorityId',
          public: 'MultiSigner'
        },
        PreCheckResultPayload: {
          block_number: 'BlockNumber',
          pre_check_list: 'Vec<PreCheckStruct>',
          pre_check_stash: 'AccountId',
          pre_check_auth: 'AuthorityId',
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
          max_offset: 'Percent',
          timestamp: 'u64'
        },
        PricePayloadSubPrice: '(PriceKey, u64, FractionLength, JsonNumberValue, u64)',
        PricePayloadSubJumpBlock: '(PriceKey, RequestInterval)',
        PricePayload: {
          block_number: 'BlockNumber',
          price: 'Vec<PricePayloadSubPrice>',
          jump_block: 'Vec<PricePayloadSubJumpBlock>',
          auth: 'AuthorityId',
          public: 'MultiSigner'
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
          avg_keep_duration: 'u64'
        },
        PurchasedForceCleanPayload: {
          BlockNumber: 'BlockNumber',
          purchase_id_list: 'Vec<Vec<u8>>',
          auth: 'AuthorityId',
          public: 'MultiSigner'
        },
        PurchaseId: 'Vec<u8>',
        Releases: {
          _enum: [
            'V1_0_0_Ancestral',
            'V1_0_1_HttpErrUpgrade',
            'V1_1_0_HttpErrUpgrade',
            'V1_2_0'
          ]
        },
        RequestInterval: 'u8',
        StatusErr: '(u16)',
        SymbolEstimatesConfig: {
          symbol: 'Bytes',
          estimates_type: 'EstimatesType',
          id: 'u64',
          ticket_price: 'Balance',
          symbol_completed_price: 'u64',
          symbol_fraction: 'FractionLength',
          start: 'BlockNumber',
          end: 'BlockNumber',
          distribute: 'BlockNumber',
          deviation: 'Option<Permill>',
          range: 'Option<Vec<u64>>',
          total_reward: 'Balance',
          state: 'EstimatesState'
        }
      }
    }
  ]
};

export default definitions;
