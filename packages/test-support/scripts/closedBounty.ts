// Copyright 2017-2020 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringPair } from '@polkadot/keyring/types';

import BN from 'bn.js';

import { ApiPromise } from '@polkadot/api';
import { createApi } from '@polkadot/test-support/api';
import { aliceSigner, bobSigner, charlieSigner } from '@polkadot/test-support/keyring';
import { waitForBountyState, waitForClaim } from '@polkadot/test-support/utils/waitFor';

import { acceptCurator,
  approveBounty,
  awardBounty,
  claimBounty,
  proposeBounty,
  proposeCurator } from './lib/changeBountyStateFunctions';
import { FUNDING_TIME, PAYOUT_TIME } from './lib/constants';

async function proposeBounties (api: ApiPromise, numberOfBounties: number) {
  const indexes = [];

  for (let i = 0; i < numberOfBounties; i++) {
    indexes.push(await proposeBounty(api, new BN(500_000_000_000_000), `new bounty nr ${i} hello hello more bytes`, aliceSigner()));
  }

  return indexes;
}

async function closedBounty (api: ApiPromise, index: number, signer: KeyringPair) {
  await approveBounty(api, index, signer);

  await waitForBountyState(api, 'isFunded', index, { interval: 2000, timeout: FUNDING_TIME });

  await proposeCurator(api, index, signer);

  await acceptCurator(api, index, signer);

  await awardBounty(api, index, signer);

  await waitForClaim(api, index, { interval: 2000, timeout: PAYOUT_TIME });

  await claimBounty(api, index, signer);
  process.exit(0);
}

(async () => {
  const api = await createApi(9944);

  const indexes = await proposeBounties(api, 3);

  await Promise.all([closedBounty(api, indexes[0], aliceSigner()), closedBounty(api, indexes[1], bobSigner()), closedBounty(api, indexes[2], charlieSigner())]).catch(console.error);
})();

// closedBounty().catch(console.error);
