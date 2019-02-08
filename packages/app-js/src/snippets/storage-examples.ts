import { ApiPromise } from '@polkadot/api';
import {
  ALICE, createLog, createError, createWrapper
} from '../commons';

// https://polkadot.js.org/api/examples/promise/05_read_storage/
export default async (provider) => {
  const wrapper = createWrapper('read-storage', 'Promise - Read Chain State');
  try {
    // Create our API with a connection to the node
    const api = await ApiPromise.create(provider);
    // Make our basic chain state/storage queries, all in one go
    const [accountNonce, blockPeriod, validators] = await Promise.all([
      api.query.system.accountNonce(ALICE),
      api.query.timestamp.blockPeriod(),
      api.query.session.validators()
    ]);

    createLog(`Account Alice: ${ALICE} <br />AccountNonce: ${accountNonce}`, wrapper);
    createLog(`blockPeriod ${blockPeriod.toNumber()} seconds`, wrapper);

    if (validators && validators.length > 0) {
      // Retrieve the balances for all validators
      createLog('Validators', wrapper, 'highlight');
      const validatorBalances = await Promise.all(
        validators.map(authorityId => api.query.balances.freeBalance(authorityId))
      );

      validators.forEach((authorityId, index) => {
        createLog(`Validator: ${authorityId.toString()} <br />Balance: ${validatorBalances[index].toString()}`, wrapper);
      });
    }
  } catch (e) {
    createError(e, wrapper);
  }
};
