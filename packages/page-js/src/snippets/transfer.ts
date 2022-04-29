// Copyright 2017-2022 @polkadot/app-js authors & contributors
// SPDX-License-Identifier: Apache-2.0

export default `// transfer
const sender = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
const recipient = '5F2PCyGDWGDJyLRV15NrBsEa9Y61BS1dfAwzbfk7yR6DBm7P';

const nonce = await api.query.system.accountNonce(ALICE),

console.log('Current nonce', nonce);

const unsub = await api.tx.balances
  .transfer(recipient,12345)
  .signAndSend(sender, ({ events = [], status }) => {
    console.log('Transaction status:', status.type);

    if (status.isInBlock) {
      console.log('Completed at block hash', status.asInBlock.toHex());
      console.log('Events:');

      events.forEach(({ phase, event: { data, method, section } }) => {
        console.log('\t', phase.toString(), \`: \${section}.\${method}\`, data.toString());
      });

      unsub();
    }
  });`;
