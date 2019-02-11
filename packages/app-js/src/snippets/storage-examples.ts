// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Snippet } from '@polkadot/app-js/types';

export const storageGetInfo: Snippet = {
  value: 'storageGetInfo',
  text: 'Get chain state information',
  label: { color: 'blue', children: 'Storage', size: 'tiny' },
  code: `// Get chain state information
const ALICE = '5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ';
// Make our basic chain state/storage queries, all in one go
const [accountNonce, blockPeriod, validators] = await Promise.all([
  api.query.system.accountNonce(ALICE),
  api.query.timestamp.blockPeriod(),
  api.query.session.validators()
]);
console.log('Account: ' + ALICE + ' -- AccountNonce: ' + accountNonce);
console.log('blockPeriod in seconds: ' + blockPeriod.toNumber());
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

export const storageGetBalanceInformation: Snippet = {
  value: 'storageGetBalanceInformation',
  text: 'Get current transfer fee',
  label: { color: 'blue', children: 'Storage', size: 'tiny' },
  code: `// Listen to the total transfer fee for 5 Blocks
let count = 0;
const unsub = await api.query.balances.transferFee((sum) => {
  console.log('Transfer fee: '+ sum);

  if (++count === 5) {
    console.log('listened to 5 blocks, unsubscribing');
    unsub();
  }
});`
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
const ALICE = '5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ';

// Retrieve the initial balance.
let previous = await api.query.balances.freeBalance(ALICE);
console.log('ALICE has a balance of' + previous);

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
