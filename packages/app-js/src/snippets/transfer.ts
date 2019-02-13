// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export default `// transfer
const sender = '5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ';
const recipient = '5GTZEKgRKX2a5hepNjwTBzR5nR6UqtEsMZ4TnL1Yuah1N2Tu';

const unsub = await api.tx.balances
  .transfer(recipient,12345)
  .signAndSend(sender, ({ events = [], status, type }) => {
    console.log('Transaction status:', type);

    if (type === 'Finalised') {
      console.log('Completed at block hash', status.asFinalised.toHex());
      console.log('Events:');

      events.forEach(({ phase, event: { data, method, section } }) => {
        console.log('\t', phase.toString(), \`: \${section}.\${method}\`, data.toString());
      });

      unsub();
    }
  });`;
