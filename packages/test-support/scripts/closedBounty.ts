// Copyright 2017-2020 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

import { createApi } from '@polkadot/test-support/api';
import { waitForBountyState, waitForClaim } from '@polkadot/test-support/utils/waitFor';

import { acceptCurator,
  approveBounty,
  awardBounty,
  claimBounty,
  proposeBounty,
  proposeCurator } from './lib/changeBountyStateFunctions';
import { FUNDING_TIME, PAYOUT_TIME } from './lib/constants';

async function closedBounty () {
  const api = await createApi(9944);

  const index = await proposeBounty(api, new BN(500_000_000_000_000), 'new bounty hello hello more bytes2');

  await approveBounty(api, index);

  await waitForBountyState(api, 'isFunded', index, { interval: 2000, timeout: FUNDING_TIME });

  await proposeCurator(api, index);

  await acceptCurator(api, index);

  await awardBounty(api, index);

  await waitForClaim(api, index, { interval: 2000, timeout: PAYOUT_TIME });

  await claimBounty(api, index);
  process.exit(0);
}

closedBounty().catch(console.error);
