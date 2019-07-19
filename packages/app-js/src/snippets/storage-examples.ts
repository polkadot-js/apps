// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Snippet } from '@polkadot/app-js/types';

export const storageGetInfo: Snippet = {
  value: 'storageGetInfo',
  text: 'Get chain state information',
  label: { color: 'blue', children: 'Storage', size: 'tiny' },
  code: `// Get chain state information
// Make our basic chain state / storage queries, all in one go

const [now, minimumValidatorCount, validators] = await Promise.all([
  api.query.timestamp.now(),
  api.query.staking.minimumValidatorCount(),
  api.query.session.validators()
]);

console.log('The current date is: ' + now);
console.log('The minimum validator count: ' + minimumValidatorCount);

if (validators && validators.length > 0) {
  // Retrieve the balances for all validators
  console.log('Validators');

  const validatorBalances = await Promise.all(
    validators.map(authorityId => api.query.balances.freeBalance(authorityId))
  );

  validators.forEach((authorityId, index) => {
    console.log('Validator: ' + authorityId.toString() )
    console.log('Balance: ' + validatorBalances[index].toString() );
  });
}
`
};

export const storageSystemEvents: Snippet = {
  value: 'storageSystemEvents',
  text: 'Listen to system events',
  label: { color: 'blue', children: 'Storage', size: 'tiny' },
  code: `// Subscribe to system events via storage
api.query.system.events((events) => {
  console.log('----- Received ' + events.length + ' event(s): -----');
  // loop through the Vec<EventRecord>
  events.forEach((record) => {
  // extract the phase, event and the event types
    const { event, phase } = record;
    const types = event.typeDef;
    // show what we are busy with
    console.log(event.section + ':' + event.method + '::' + 'phase=' + phase.toString());
    console.log(event.meta.documentation.toString());
    // loop through each of the parameters, displaying the type and data
    event.data.forEach((data, index) => {
      console.log(types[index].type + ';' + data.toString());
    });
  });
});`
};

export const storageListenToBalanceChange: Snippet = {
  value: 'storageListenToBalanceChange',
  text: 'Listen to balance changes',
  label: { color: 'blue', children: 'Storage', size: 'tiny' },
  code: `// You may leave this example running and make a transfer
// of any value from or to Alice address in the 'Transfer' App
const ALICE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';

// Retrieve the initial balance.
let previous = await api.query.balances.freeBalance(ALICE);

console.log('ALICE has a balance of ' + previous);

// Subscribe and listen to balance changes
api.query.balances.freeBalance(ALICE, (balance) => {
  // Calculate the delta
  const change = balance.sub(previous);
  // Only display positive value changes (Since we are pulling 'previous' above already,
  // the initial balance change will also be zero)
  if (!change.isZero()) {
    previous = balance;
    console.log('New transaction of: '+ change);
  }
});`
};

export const storageListenToMultipleBalancesChange: Snippet = {
  value: 'storageListenToMultipleBalancesChange',
  text: 'Listen to multiple balances changes',
  label: { color: 'blue', children: 'Storage', size: 'tiny' },
  code: `// You may leave this example running and make a transfer
// of any value from or to Alice/Bob address in the 'Transfer' App
const ALICE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
const BOB = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';

console.log('Tracking balances for:', [ALICE, BOB])

// Subscribe and listen to several balance changes
api.query.balances.freeBalance.multi([ALICE, BOB], (balances) => {
  console.log('Change detected, new balances: ', balances)
});`
};

export const storageRetrieveInfoOnQueryKeys: Snippet = {
  value: 'storageRetrieveInfoOnQueryKeys',
  text: 'Retrieve Info on query keys',
  label: { color: 'blue', children: 'Storage', size: 'tiny' },
  code: `// This example set shows how to make queries and retrieve info on query keys
const ALICE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';

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
const currHash = await api.query.balances.freeBalance.hash(ALICE);
const currSize = await api.query.balances.freeBalance.size(ALICE);

console.log('Alice balance entry has a value hash of', currHash, 'with a size of', currSize);`
};
