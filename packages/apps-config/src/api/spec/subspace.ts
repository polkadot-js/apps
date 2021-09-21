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
        PoCKind: '[u8; 16]',
        RpcSolution: {
          public_key: '[u8; 32]',
          nonce: 'u64',
          encoding: 'Vec<u8>',
          signature: 'Vec<u8>',
          tag: '[u8; 8]'
        },
        ProposedProofOfSpaceResult: {
          slot_number: 'Slot',
          solution: 'Option<RpcSolution>',
          secret_key: 'Vec<u8>'
        },
        RpcNewSlotInfo: {
          slot_number: 'Slot',
          challenge: '[u8; 8]',
          salt: '[u8; 8]',
          next_salt: 'Option<[u8; 8]>',
          solution_range: 'u64'
        },
        PoCRandomness: '[u8; 32]',
        FarmerSignature: 'Signature',
        FarmerId: 'AccountId',
        PoCBlockWeight: 'u32',
        PoCNextEpochDescriptor: {
          randomness: 'PoCRandomness'
        },
        PoCNextConfigDescriptorV1: {
          c: '(u64, u64)'
        },
        PoCNextConfigDescriptor: {
          _enum: {
            V0: 'Null',
            V1: 'PoCNextConfigDescriptorV1'
          }
        },
        SolutionRangeDescriptor: {
          solution_range: 'u64'
        },
        SaltDescriptor: {
          salt: 'u64'
        },
        NextSolutionRangeDescriptor: {
          solution_range: 'u64'
        },
        NextSaltDescriptor: {
          salt: 'u64'
        },
        PoCEpochConfiguration: {
          c: '(u64, u64)'
        },
        ConsensusLog: {
          _enum: {
            Phantom: 'Null',
            NextEpochData: 'PoCNextEpochDescriptor',
            NextConfigData: 'PoCNextConfigDescriptor',
            SolutionRangeData: 'SolutionRangeDescriptor',
            SaltData: 'SaltDescriptor',
            NextSolutionRangeData: 'NextSolutionRangeDescriptor',
            NextSaltData: 'NextSaltDescriptor'
          }
        },
        Solution: {
          public_key: 'FarmerId',
          nonce: 'u64',
          encoding: 'Vec<u8>',
          signature: 'Vec<u8>',
          tag: '[u8; 8]'
        },
        PreDigest: {
          slot: 'Slot',
          solution: 'Solution'
        },
        EquivocationProof: {
          offender: 'FarmerId',
          slot: 'Slot',
          first_header: 'Header',
          second_header: 'Header'
        },
        PoCEquivocationOffence: {
          slot: 'Slot',
          offender: 'FarmerId'
        },
        PoCGenesisConfiguration: {
          slot_duration: 'u64',
          epoch_length: 'u64',
          c: '(u64, u64)',
          randomness: 'PoCRandomness'
        },
        Kind: 'PoCKind',
        Randomness: 'PoCRandomness',
        NextEpochDescriptor: 'PoCNextEpochDescriptor',
        NextConfigDescriptorV1: 'PoCNextConfigDescriptorV1',
        NextConfigDescriptor: 'PoCNextConfigDescriptor'
      }
    }
  ]
};

export default definitions;
