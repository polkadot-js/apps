// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export default {
  value: 'listenToSth',
  text: 'Listen to something entirely different',
  code: `// Tis is different code
  const ALICE = '5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ';
  const [accountNonce, blockPeriod] = await Promise.all([
    api.query.system.accountNonce(ALICE),
    api.query.timestamp.blockPeriod(),
  ]);

  console.log('Account Alice: AccountNonce: '+ accountNonce);
  console.log('blockPeriod ' + blockPeriod.toNumber());`
};
