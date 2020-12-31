// Copyright 2017-2020 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

import { createApi } from '@polkadot/test-support/api';
import { sleep } from '@polkadot/test-support/utils/waitFor';

import { acceptCurator,
  approveBounty,
  awardBounty,
  claimBounty,
  proposeBounty,
  proposeCurator } from './lib/changeBountyStateFunctions';
import { FUNDING_TIME, PAYOUT_TIME } from './lib/constants';

async function closedBounty () {
  const api = await createApi(9944);

  await proposeBounty(api, new BN(500_000_000_000_000), 'new bounty hello hello more bytes');

  await approveBounty(api, 0);
  await sleep(FUNDING_TIME);

  await proposeCurator(api, 0);

  await acceptCurator(api, 0);

  await awardBounty(api, 0);
  await sleep(PAYOUT_TIME);

  await claimBounty(api, 0);
  process.exit(0);
}

closedBounty().catch(console.error);
