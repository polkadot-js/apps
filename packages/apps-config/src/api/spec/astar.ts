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
        Keys: 'AccountId',
        Address: 'MultiAddress',
        LookupSource: 'MultiAddress',
        AmountOf: 'Amount',
        Amount: 'i128',
        SmartContract: {
          _enum: {
            Evm: 'H160',
            Wasm: 'AccountId'
          }
        },
        EraStakingPoints: {
          total: 'Balance',
          stakers: 'BTreeMap<AccountId, Balance>',
          formerStakedEra: 'EraIndex',
          claimedRewards: 'Balance'
        },
        EraRewardAndStake: {
          rewards: 'Balance',
          staked: 'Balance'
        },
        EraIndex: 'u32'
      }
    }
  ]
};

export default definitions;
