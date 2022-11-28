// Copyright 2017-2022 @polkadot/apps-config authors & contributors
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
        CeremonyPhaseType: {
          _enum: [
            'Registering',
            'Assigning',
            'Attesting'
          ]
        },
        CeremonyIndexType: 'u32',
        CurrencyIdentifier: 'Hash',
        CurrencyCeremony: {
          cid: 'CurrencyIdentifier',
          cindex: 'CeremonyIndexType'
        },
        Location: {
          lat: 'i64',
          lon: 'i64'
        },
        CurrencyPropertiesType: {
          name_utf8: 'Text',
          demurrage_per_block: 'i128'
        },
        ShardIdentifier: 'Hash',
        Request: {
          shard: 'ShardIdentifier',
          cyphertext: 'Vec<u8>'
        },
        Enclave: {
          pubkey: 'AccountId',
          mrenclave: 'Hash',
          timestamp: 'u64',
          url: 'Text'
        }
      }
    }
  ]
};

export default definitions;
