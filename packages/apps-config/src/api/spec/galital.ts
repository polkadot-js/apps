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
        Address: 'AccountId',
        LookupSource: 'AccountId',
        Account: {
          nonce: 'U256',
          balance: 'U256'
        },
        Transaction: {
          nonce: 'U256',
          action: 'String',
          gas_price: 'u64',
          gas_limit: 'u64',
          value: 'U256',
          input: 'Vec<u8>',
          signature: 'Signature'
        },
        Signature: {
          v: 'u64',
          r: 'H256',
          s: 'H256'
        },
        Keys: 'SessionKeys5'
      }
    }
  ]
};

export default definitions;
