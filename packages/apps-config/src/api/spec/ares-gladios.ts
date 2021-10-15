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
        FractionLength: 'u32',
        RequestInterval: 'u8',
        JsonNumberValue: {
          integer: 'u64',
          fraction: 'u64',
          fraction_length: 'u32',
          exponent: 'u32'
        },
        PricePayloadSubPrice: '(Bytes, u64, FractionLength, JsonNumberValue)',
        PricePayload: {
          block_number: 'BlockNumber',
          price: 'Vec<PricePayloadSubPrice>',
          public: 'AccountId'
        }
      }
    }
  ]
};

export default definitions;
