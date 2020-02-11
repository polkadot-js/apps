// Copyright 2017-2020 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// eslint:disable

export default {
  AnchorData: {
    id: 'H256',
    doc_root: 'H256',
    anchored_block: 'u64'
  },
  Fee: {
    key: 'Hash',
    price: 'Balance'
  },
  PreCommitData: {
    signing_root: 'H256',
    identity: 'H256',
    expiration_block: 'u64'
  },
  Proof: {
    leaf_hash: 'H256',
    sorted_hashes: 'H256'
  },
  // Workarounds
  BalanceLock: 'BalanceLockTo212' // workaround for balances not showing up, see https://github.com/polkadot-js/apps/issues/2236
};
