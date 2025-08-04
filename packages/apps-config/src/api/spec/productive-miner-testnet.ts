import type { OverrideBundleDefinition } from '@polkadot/types/types';

// ProductiveMiner TestNet API types
const definitions: OverrideBundleDefinition = {
  types: [
    {
      // Custom types for ProductiveMiner TestNet
      minmax: [0, undefined],
      types: {
        // Add any custom types specific to ProductiveMiner TestNet here
        'MinedToken': {
          _enum: ['MINED']
        },
        'ComputationalResult': {
          problemType: 'Text',
          result: 'Text',
          timestamp: 'u64',
          blockNumber: 'u64'
        },
        'SolidarityMember': {
          accountId: 'AccountId',
          joinedAt: 'u64',
          totalContributed: 'u128',
          reputation: 'u32'
        }
      }
    }
  ]
};

export default definitions; 