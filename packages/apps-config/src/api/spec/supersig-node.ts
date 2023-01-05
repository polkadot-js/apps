// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';
//import supersig from '@interlay/supersig-types';


const definitions: OverrideBundleDefinition = {
  types: [
    {
      minmax: [
        0,
        null
      ],
      types: {
        Role: {
          _enum: {
            Standard: 'Vec<u8>',
            Master: 'Vec<u8>',
            NotMember: 'Vec<u8>'
          }
        },
        SupersigId: 'u132',
        CallId: 'u32',
        ProposalStates: 'Vec<ProposalState<AccountId>>',
        FetchListProposals: {
          proposals_info: 'ProposalStates',
          no_of_members: 'u32'
        },
        ProposalState: {
          id: 'CallId',
          encoded_call: 'Vec<u8>',
          provider: 'AccountId',
          voters: 'Vec<AccountId>'
        },
        FetchProposalState: {
          proposal_info: 'ProposalState<AccountId>',
          no_of_members: 'u32'
        }
      }
    }
  ],
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
        type: 'FetchProposalState'
      },
      getUserSupersigs: {
        description: 'Get supersigs associated to the user.',
        params: [
          {
            name: 'user_account',
            type: 'AccountId'
          }
        ],
        type: 'Vec<SupersigId>'
      },
      listMembers: {
        description: 'List members of the supersig',
        params: [
          {
            name: 'supersig_id',
            type: 'AccountId'
          }
        ],
        type: 'Vec<(AccountId, Role)>'
      },
      listProposals: {
        description: 'List proposals associated to a supersig',
        params: [
          {
            name: 'supersig_id',
            type: 'AccountId'
          }
        ],
        type: 'FetchListProposals'
      }
    }
  },
};

export default definitions;

// export default {

// } as OverrideBundleDefinition;


// "node-template": {
//   "types": [
//       {
//           "minmax": [
//               0,
//               null
//           ],
//           "types": {
//             "Role": { 
//               "_enum": {
//                 "Standard": "Vec<u8>",
//                 "Master": "Vec<u8>",
//                 "NotMember": "Vec<u8>"
//               } 
//             },
//             "SupersigId": "u128",
//             "CallId": "u32",
//             "ProposalStates": "Vec<ProposalState<AccountId>>",
//             "FetchListProposals": {
//               "proposals_info": "ProposalStates",
//               "no_of_members": "u32"
//             },
//             "ProposalState": {
//               "id": "CallId",
//               "encoded_call": "Vec<u8>",
//               "provider": "AccountId",
//               "voters": "Vec<AccountId>",
//             },
//             "FetchProposalState": {
//               "proposal_info": "ProposalState<AccountId>",
//               "no_of_members": "u32"
//             },
//             },
//         },
//     ],
//   "rpc": {
//       "superSig": {
//         "getProposalState": {
//           "description": "Get the proposal state",
//           "params": [
//             {
//               "name": "supersig_id",
//               "type": "AccountId"
//             },
//             {
//               "name": "call_id",
//               "type": "CallId"
//             }
//           ],
//          "type": "FetchProposalState"
//         },
//         "getUserSupersigs": {
//           "description": "Get supersigs associated to the user.",
//           "params": [
//               {
//               "name": "user_account",
//               "type": "AccountId"
//               }
//           ],
//           "type": "Vec<SupersigId>"
//         },
//         "listMembers": {
//           "description": "List members of the supersig",
//           "params": [
//               {
//               "name": "supersig_id",
//               "type": "AccountId"
//               }
//           ],
//           "type": "Vec<(AccountId, Role)>"
//         },
//         "listProposals": {
//           "description": "List proposals associated to a supersig",
//           "params": [
//               {
//               "name": "supersig_id",
//               "type": "AccountId"
//               }
//           ],
          
//           "type": "FetchListProposals",
//         },
//       },
//     },
// },

