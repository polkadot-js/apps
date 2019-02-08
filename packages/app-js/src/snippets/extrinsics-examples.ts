import { ApiPromise } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { stringToU8a } from '@polkadot/util';

import {
  BOB, createButton, createLog, createError, createWrapper
} from '../commons';

// https://polkadot.js.org/api/examples/promise/06_make_transfer/
export default (provider) => {
  const wrapper = createWrapper('make-transfer', 'Promise - Make Transfer');
  const makeTransfer = async (provider) => {
    try {
      // Create our API with a connection to the node
      const api = await ApiPromise.create(provider);
      // Get a random number between 1 and 100000
      const randomAmount = Math.floor((Math.random() * 100000) + 1);
      // Get Alice seed
      const ALICE_SEED = 'Alice'.padEnd(32, ' ');
      // Create an instance of the keyring
      const keyring = new Keyring();
      // Add Alice to our keyring (with the known seed for the account)
      const alice = keyring.addFromSeed(stringToU8a(ALICE_SEED));
      // Create a extrinsic, transferring randomAmount units to Bob.
      // We can also create sign and send in two operations.
      const transfer = api.tx.balances.transfer(BOB, randomAmount);
      // Sign and Send the transaction
      transfer.signAndSend(alice, ({ status, type }) => {
        if (type === 'Finalised') {
          createLog(`Successful transfer of ${randomAmount} from <b>Alice</b> to <b>Bob</b> with hash ${status.asFinalised.toHex()}`, wrapper);
        } else {
          createLog(`Status of transfer: ${type}`, wrapper);
        }
      });
    } catch (e) {
      createError(e, wrapper);
    }
  };
  createButton(makeTransfer, wrapper, 'Initialize transfer');
};
