// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

export default {
  rpc: {
    superSig: {
      getProposalState: {
        description: 'Get the proposal state',
        params: [
          {
            name: 'supersig_id',
            type: 'AccountId'
          },
          {
            name: 'call_id',
            type: 'CallId'

          }
        ],
        type: 'Result<(ProposalState<AccountId>, u32), DispatchError>'
      },
      get_user_supersigs: {
        description: 'Get supersigs associated to the user.',
        params: [
          {
            name: 'user_account',
            type: 'AccountId'
          }
        ],
        type: 'Vec<SupersigId>'
      },
      list_members: {
        description: 'List members of the supersig',
        params: [
          {
            name: 'supersig_id',
            type: 'AccountId'
          }
        ],
        type: 'Vec<(AccountId, Role)'
      },
      list_proposals: {
        description: 'List proposals associated to a supersig',
        params: [
          {
            name: 'supersig_id',
            type: 'AccountId'
          }
        ],
        type: 'Result<(Vec<ProposalState<AccountId>>, u32), DispatchError>'
      }
    }
  }
} as OverrideBundleDefinition;
