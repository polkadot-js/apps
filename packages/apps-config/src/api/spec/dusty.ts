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
        AccountInfo: 'AccountInfoWithProviders',
        AuthorityId: 'AccountId',
        AuthorityVote: 'u32',
        ChallengeGameOf: {
          challenges: 'Vec<Hash>',
          createdBlock: 'BlockNumber',
          decision: 'Decision',
          propertyHash: 'Hash'
        },
        Claim: {
          amount: 'u128',
          approve: 'BTreeSet<AuthorityId>',
          complete: 'bool',
          decline: 'BTreeSet<AuthorityId>',
          params: 'Lockdrop'
        },
        ClaimId: 'H256',
        ClaimVote: {
          approve: 'bool',
          authority: 'u16',
          claim_id: 'ClaimId'
        },
        Decision: {
          _enum: ['Undecided', 'True', 'False']
        },
        DollarRate: 'u128',
        EraIndex: 'u32',
        EraStakingPoints: {
          individual: 'BTreeMap<AccountId, Balance>',
          total: 'Balance'
        },
        Keys: 'SessionKeys3',
        Lockdrop: {
          duration: 'u64',
          public_key: '[u8; 33]',
          transaction_hash: 'H256',
          type: 'u8',
          value: 'u128'
        },
        Parameters: {
          canBeNominated: 'bool',
          optionExpired: 'u128',
          optionP: 'u32'
        },
        PredicateContractOf: {
          inputs: 'Vec<u8>',
          predicateHash: 'Hash'
        },
        PredicateHash: 'Hash',
        PrefabOvmModule: {
          code: 'Vec<u8>',
          scheduleVersion: 'u32'
        },
        Property: {
          inputs: 'Vec<Vec<u8>>',
          predicateAddress: 'AccountId'
        },
        PropertyOf: {
          inputs: 'Vec<Vec<u8>>',
          predicateAddress: 'AccountId'
        },
        Schedule: {
          putCodePerByteCost: 'Weight',
          version: 'u32'
        },
        SmartContract: {
          _enum: {
            Wasm: 'AccountId',
            Evm: 'H160'
          }
        },
        StakingParameters: {
          canBeNominated: 'bool',
          optionExpired: 'u128',
          optionP: 'u32'
        },
        TickerRate: {
          authority: 'u16',
          btc: 'u128',
          eth: 'u128'
        },
        VoteCounts: {
          bad: 'u32',
          good: 'u32'
        }
      }
    }
  ]
};

export default definitions;
