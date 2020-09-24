// For passing to the ApiPromise object
const rpcDefs = {
  poa: {
    treasuryAccount: {
      description: 'Return account address of treasury. The account address can then be used to query the chain for balance',
      params: [],
      type: 'AccountId',
    },
    treasuryBalance: {
      description: 'Return free balance of treasury account. In the context of PoA, only free balance makes sense for treasury. But just in case, to check all kinds of balance (locked, reserved, etc), get the account address with above call and query the chain.',
      params: [],
      type: 'Balance',
    },
  },
};

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


export {
  rpcDefs, 
  poaRpcDefs
};
