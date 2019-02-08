import { ApiPromise } from '@polkadot/api';

import {
  ALICE, createButton, createLog, createError, createWrapper
} from '../commons';
// import the test keyring (already has dev keys for Alice, Bob, Charlie, Eve & Ferdie)
import testKeyring from '@polkadot/keyring/testing';
// utility function for random values
import { randomAsU8a } from '@polkadot/util-crypto';

// https://polkadot.js.org/api/examples/promise/09-transfer-events/
export default (provider) => {
  const wrapper = createWrapper('transfer-events', 'Promise - Transfer Events');
  const makeTransfer = async (provider) => {
    try {
      // Create our API with a connection to the node
      const api = await ApiPromise.create(provider);
      // Get a random amount between 1 and 100000
      const randomAmount = Math.floor((Math.random() * 100000) + 1);
      // create an instance of our testing keyring
      const keyring = testKeyring();
      // get the nonce for Alice account
      const aliceNonce = await api.query.system.accountNonce(ALICE);
      // find the actual keypair in the keyring
      const alicePair = keyring.getPair(ALICE);
      // create a new random recipient
      const recipient = keyring.addFromSeed(randomAsU8a(32)).address();
      createLog(`Sending ${randomAmount} from ${alicePair.address()} to ${recipient} with nonce ${aliceNonce.toString()}`, wrapper);
      // Create a extrinsic, transferring randomAmount units to randomAccount.
      api.tx.balances
        .transfer(recipient, randomAmount)
        .signAndSend(alicePair, ({ events = [], status, type }) => {
          // Log transfer events
          createLog(`Transaction status: ${type}`, wrapper);
          if (type === 'Finalised') {
            createLog(`Completed at block hash: ${status.asFinalised.toHex()}`, wrapper);
            createLog(`Events:`, wrapper, 'highlight');
            events.forEach(({ phase, event: { data, method, section } }) => {
              createLog(`${phase.toString()}: ${section}.${method} ${data.toString()}`, wrapper);
            });
            createLog('------------', wrapper, 'highlight');
          }
        });
    } catch (e) {
      createError(e, wrapper);
    }
  };
  createButton(makeTransfer, wrapper, 'Initialize transfer');
};
