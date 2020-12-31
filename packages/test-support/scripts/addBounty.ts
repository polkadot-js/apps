// Copyright 2017-2020 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

import { createApi } from '@polkadot/test-support/api';
import { aliceSigner, bobSigner, charlieSigner, daveSigner } from '@polkadot/test-support/keyring';
import { execute } from '@polkadot/test-support/transaction';
import { sleep } from '@polkadot/test-support/utils/waitFor';

const TREASURY_ADDRESS = '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB';

async function addBounty () {
  const api = await createApi(9944);

  await execute(api.tx.bounties.proposeBounty(new BN(500_000_000_000_000), 'new bounty hello hello more bytes'), aliceSigner());

  await execute(api.tx.council.propose(4, api.tx.bounties.approveBounty(0), 100000), aliceSigner());

  const hashes = await api.query.council.proposals();

  await execute(api.tx.council.vote(hashes[0], 0, true), bobSigner());
  await execute(api.tx.council.vote(hashes[0], 0, true), charlieSigner());
  await execute(api.tx.council.vote(hashes[0], 0, true), daveSigner());

  await execute(api.tx.council.close(hashes[0], 0, new BN('10000000000'), 100000), charlieSigner());

  await execute(api.tx.balances.transfer(TREASURY_ADDRESS, new BN(5_000_000_000_000_000)), aliceSigner());
  console.log('Waiting for funding');
  await sleep(61000);
  process.exit(0);
}

addBounty().catch(console.error);
