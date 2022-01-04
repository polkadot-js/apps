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
        ResourceId: '[u8; 32]',
        DepositNonce: 'u64',
        ProposalStatus: {
          _enum: [
            'Initiated',
            'Approved',
            'Rejected'
          ]
        },
        ProposalVotes: {
          votes_for: 'Vec<AccountId>',
          votes_against: 'Vec<AccountId>',
          status: 'ProposalStatus'
        },
        BridgeTokenId: 'U256',
        BridgeChainId: 'u8',
        VestingPlan: {
          start_time: 'u64',
          cliff_duration: 'u64',
          total_duration: 'u64',
          interval: 'u64',
          initial_amount: 'Balance',
          total_amount: 'Balance',
          vesting_during_cliff: 'bool'
        }
      }
    }
  ]
};

export default definitions;
