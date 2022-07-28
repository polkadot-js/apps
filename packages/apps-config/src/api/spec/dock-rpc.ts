// For showing available RPC calls in UI
const poaRpcDefs = {
  treasuryAccount: {
    alias: ["poa_treasuryAccount"],
    description:
      "Return account address of treasury. The account address can then be used to query the chain for balance",
    params: [
      {
        name: "hash",
        type: "BlockHash",
        isCached: true,
        isOptional: true
      }
    ],
    type: "AccountId",
    method: "treasuryAccount",
    section: "poa"
  },
  treasuryBalance: {
    alias: ["poa_treasuryBalance"],
    description:
      "Return free balance of treasury account. In the context of PoA, only free balance makes sense for treasury. But just in case, to check all kinds of balance (locked, reserved, etc), get the account address with above call and query the chain.",
    params: [
      {
        name: "hash",
        type: "BlockHash",
        isOptional: true
      }
    ],
    type: "Balance",
    method: "treasuryBalance",
    section: "poa"
  }
};

const stakingRewardsRpcDefs = {
  yearlyEmission: {
    alias: ["staking_rewards_yearlyEmission"],
    description: "",
    params: [
      {
        name: "total_staked",
        type: "Balance"
      },
      {
        name: "total_issuance",
        type: "Balance"
      },
      {
        name: "hash",
        type: "BlockHash",
        isCached: true,
        isOptional: true
      }
    ],
    type: "Balance",
    method: "yearlyEmission",
    section: "staking_rewards"
  },
  maxYearlyEmission: {
    alias: ["staking_rewards_maxYearlyEmission"],
    description: "",
    params: [
      {
        name: "hash",
        type: "BlockHash",
        isOptional: true
      }
    ],
    type: "Balance",
    method: "maxYearlyEmission",
    section: "staking_rewards"
  }
};

const coreModsRpcDefs = {
  bbsPlusPublicKeyWithParams: {
    alias: ['core_mods_bbsPlusPublicKeyWithParams'],
    description: "Return BBS+ public key with params",
    method: 'bbsPlusPublicKeyWithParams',
    section: 'core_mods',
    params: [
      {
        name: "id",
        type: "BBSPlusPublicKeyStorageKey"
      },
      {
        name: "hash",
        type: "BlockHash",
        isCached: true,
        isOptional: true
      }
    ],
    type: "Option<BBSPlusPublicKeyWithParams>"
  },
  bbsPlusParamsByDid: {
    alias: ['core_mods_bbsPlusParamsByDid'],
    description: "Return all BBS+ params by a DID",
    method: 'bbsPlusParamsByDid',
    section: 'core_mods',
    params: [
      {
        name: "did",
        type: "Did"
      },
      {
        name: "hash",
        type: "BlockHash",
        isCached: true,
        isOptional: true
      }
    ],
    type: "BTreeMap<IncId, BBSPlusParameters>"
  },
  bbsPlusPublicKeysByDid: {
    alias: ['core_mods_bbsPlusPublicKeysByDid'],
    description: "Return all BBS+ key with params by a DID",
    method: 'bbsPlusPublicKeysByDid',
    section: 'core_mods',
    params: [
      {
        name: "did",
        type: "Did"
      },
      {
        name: "hash",
        type: "BlockHash",
        isCached: true,
        isOptional: true
      }
    ],
    type: "BTreeMap<IncId, BBSPlusPublicKeyWithParams>"
  },
  accumulatorPublicKeyWithParams: {
    alias: ['core_mods_accumulatorPublicKeyWithParams'],
    description: "Return Accumulator public key with params",
    method: 'accumulatorPublicKeyWithParams',
    section: 'core_mods',
    params: [
      {
        name: "id",
        type: "AccumPublicKeyStorageKey"
      },
      {
        name: "hash",
        type: "BlockHash",
        isCached: true,
        isOptional: true
      }
    ],
    type: "Option<AccumPublicKeyWithParams>"
  },
  accumulatorWithPublicKeyAndParams: {
    alias: ['core_mods_accumulatorWithPublicKeyAndParams'],
    description: "Return Accumulator public key with params",
    method: 'accumulatorWithPublicKeyAndParams',
    section: 'core_mods',
    params: [
      {
        name: "id",
        type: "AccumulatorId"
      },
      {
        name: "hash",
        type: "BlockHash",
        isCached: true,
        isOptional: true
      }
    ],
    type: "Option<(Vec<u8>, Option<AccumPublicKeyWithParams>)>"
  },
  didDetails: {
    alias: ['core_mods_didDetails'],
    description: "Get all keys, controllers and service endpoints of the DID",
    method: 'didDetails',
    section: 'core_mods',
    params: [
      {
        name: "did",
        type: "Did"
      },
      {
        name: "params",
        type: "u8",
        isOptional: true
      },
      {
        name: "hash",
        type: "BlockHash",
        isCached: true,
        isOptional: true
      }
    ],
    type: "Option<AggregatedDidDetailsResponse>"
  },
  didListDetails: {
    alias: ['core_mods_didListDetails'],
    description: "Get all keys, controllers and service endpoints of the DID",
    method: 'didListDetails',
    section: 'core_mods',
    params: [
      {
        name: "dids",
        type: "Vec<Did>"
      },
      {
        name: "params",
        type: "u8",
        isOptional: true
      },
      {
        name: "hash",
        type: "BlockHash",
        isCached: true,
        isOptional: true
      }
    ],
    type: "Vec<Option<AggregatedDidDetailsResponse>>"
  }
};

export { poaRpcDefs, stakingRewardsRpcDefs, coreModsRpcDefs };
