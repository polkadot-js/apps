// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export default `// transfer
const sender = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
const recipient = '5F2PCyGDWGDJyLRV15NrBsEa9Y61BS1dfAwzbfk7yR6DBm7P';

const nonce = await api.query.system.accountNonce(ALICE),

console.log('Current nonce', nonce);

const unsub = await api.tx.balances
  .transfer(recipient,12345)
  .signAndSend(sender, ({ events = [], status }) => {
    console.log('Transaction status:', status.type);

    if (status.isFinalized) {
      console.log('Completed at block hash', status.asFinalized.toHex());
      console.log('Events:');

      events.forEach(({ phase, event: { data, method, section } }) => {
        console.log('\t', phase.toString(), \`: \${section}.\${method}\`, data.toString());
      });

      unsub();
    }
  });`;
