// Copyright 2017-2020 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

import { createApi } from '@polkadot/test-support/api';
import { aliceSigner } from '@polkadot/test-support/keyring';
import { sleep } from '@polkadot/test-support/utils/waitFor';

import { acceptCurator, acceptMotion, awardBounty, claimBounty, fillTreasury, proposeBounty, proposeMotion } from './lib/changeBountyStateFunctions';
import { FUNDING_TIME, PAYOUT_TIME } from './lib/constants';

async function closedBounty () {
  const api = await createApi(9944);

  await proposeBounty(api, new BN(500_000_000_000_000), 'new bounty hello hello more bytes');

  await proposeMotion(api, api.tx.bounties.approveBounty(0));

  let hashes = await api.query.council.proposals();

  await acceptMotion(api, hashes[0], 0);
  await fillTreasury(api);
  console.log('Waiting for funding');
  await sleep(FUNDING_TIME);

  await proposeMotion(api, api.tx.bounties.proposeCurator(0, aliceSigner().address, 10));

  hashes = await api.query.council.proposals();

  await acceptMotion(api, hashes[0], 1);

  await acceptCurator(api, 0);

  await awardBounty(api, 0);

  await sleep(PAYOUT_TIME);
  await claimBounty(api, 0);
  process.exit(0);
}

closedBounty().catch(console.error);
