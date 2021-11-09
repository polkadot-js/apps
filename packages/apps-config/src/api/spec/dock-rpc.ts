// For showing available RPC calls in UI
const poaRpcDefs = {
  treasuryAccount: {
    alias: ['poa_treasuryAccount'],
    description: 'Return account address of treasury. The account address can then be used to query the chain for balance',
    params: [{
      name: 'hash',
      type: 'BlockHash',
      isCached: true,
      isOptional: true
    }],
    type: 'AccountId',
    method: 'treasuryAccount',
    section: 'poa'
  },
  treasuryBalance: {
    alias: ['poa_treasuryBalance'],
    description: 'Return free balance of treasury account. In the context of PoA, only free balance makes sense for treasury. But just in case, to check all kinds of balance (locked, reserved, etc), get the account address with above call and query the chain.',
    params: [{
      name: 'hash',
      type: 'BlockHash',
      isOptional: true
    }],
    type: 'Balance',
    method: 'treasuryBalance',
    section: 'poa'
  }
};

const stakingRewardsRpcDefs = {
  yearlyEmission: {
    alias: ['staking_rewards_yearlyEmission'],
    description: '',
    params: [
      {
        name: 'total_staked',
        type: 'Balance',
      },
      {
        name: 'total_issuance',
        type: 'Balance',
      },
      {
        name: 'hash',
        type: 'BlockHash',
        isCached: true,
        isOptional: true
      }
  ],
    type: 'Balance',
    method: 'yearlyEmission',
    section: 'staking_rewards'
  },
  maxYearlyEmission: {
    alias: ['staking_rewards_maxYearlyEmission'],
    description: '',
    params: [{
      name: 'hash',
      type: 'BlockHash',
      isOptional: true
    }],
    type: 'Balance',
    method: 'maxYearlyEmission',
    section: 'staking_rewards'
  }
};

const coreModsRpcDefs = {
    bbsPlusPublicKeyWithParams: {
      alias: ['core_mods_bbsPlusPublicKeyWithParams'],
      description: 'Return BBS+ public key with params',
      params: [
        {
          name: 'id',
          type: 'PublicKeyStorageKey',
        },
      ],
      type: 'Option<BbsPlusPublicKeyWithParams>',
    },
    bbsPlusParamsByDid: {
      description: 'Return all BBS+ params by a DID',
      params: [
        {
          name: 'did',
          type: 'Did',
        },
        {
          name: 'hash',
          type: 'BlockHash',
          isOptional: true
        }
      ],
      type: 'BTreeMap<u32, BbsPlusParameters>',
      method: 'bbsPlusPublicKeyWithParams',
      section: 'core_mods'
    },
    bbsPlusPublicKeysByDid: {
      alias: ['core_mods_bbsPlusPublicKeysByDid'],
      description: 'Return all BBS+ key with params by a DID',
      params: [
        {
          name: 'did',
          type: 'Did',
        },
        {
          name: 'hash',
          type: 'BlockHash',
          isOptional: true
        }
      ],
      type: 'BTreeMap<u32, BbsPlusPublicKeyWithParams>',
      method: 'bbsPlusPublicKeysByDid',
      section: 'core_mods'
    },
  };

export {
  poaRpcDefs,
  stakingRewardsRpcDefs,
  coreModsRpcDefs
};
