// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export default `// This example set shows how to make queries and retrieve info on query keys
const ALICE = '5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ';

// retrieve the balance, once-off at the latest block
const currBalance = await api.query.balances.freeBalance(ALICE);

console.log('Alice has a current balance of', currBalance);

// retrieve balance updates with an optional value callback
const balanceUnsub = await api.query.balances.freeBalance(ALICE, (balance) => {
  console.log('Alice has an updated balance of', balance);
});

// retrieve the balance at a block hash in the past
const header = await api.rpc.chain.getHeader();
const prevHash = await api.rpc.chain.getBlockHash(header.blockNumber.subn(42));
const prevBalance = await api.query.balances.freeBalance.at(prevHash, ALICE);

console.log('Alice had a balance of', prevBalance, '(42 blocks ago)');

// useful in some situations - the value hash and storage entry size
const currHash = await api.query.balanace.freeBalance.hash(ALICE);
const currSize = await api.query.balanace.freeBalance.size(ALICE);

console.log('Alice balance entry has a value hash of', currHash, 'with a size of', currSize);`;
