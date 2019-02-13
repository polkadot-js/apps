// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Snippet } from '@polkadot/app-js/types';

export const extrinsicMakeTransfer: Snippet = {
  value: 'extrinsicMakeTransfer',
  text: 'Make transfer and listen to events',
  label: { color: 'grey', children: 'Extrinsics', size: 'tiny' },
  code: `// Make a transfer from Alice to Bob and listen to system events.
// You need to be connected to a development chain for this example to work.
const ALICE = '5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ';
const BOB = '5Gw3s7q4QLkSWwknsiPtjujPv3XM4Trxi5d4PgKMMk3gfGTE';

// Get a random number between 1 and 100000
const randomAmount = Math.floor((Math.random() * 100000) + 1);

// Create a extrinsic, transferring randomAmount units to Bob.
const transfer = api.tx.balances.transfer(BOB, randomAmount);

// Sign and Send the transaction
transfer.signAndSend(ALICE, ({ events = [], status, type }) => {
  if (type === 'Finalised') {
    console.log('Successful transfer of ' + randomAmount + ' with hash ' + status.asFinalised.toHex());
  } else {
    console.log('Status of transfer: ' + type);
  }
  events.forEach(({ phase, event: { data, method, section } }) => {
    console.log(phase.toString() + ' : ' + section + '.' + method + ' ' + data.toString());
  });
});`
};
