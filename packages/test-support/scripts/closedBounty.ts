// Copyright 2017-2020 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createApi } from '@polkadot/test-support/api';
import { aliceSigner,
  bobSigner,
  charlieSigner,
  daveSigner,
  eveSigner,
  ferdieSigner } from '@polkadot/test-support/keyring';

import { acceptCurators,
  approveBounties,
  awardBounties,
  claimBounties,
  proposeBounties,
  proposeCurators,
  waitForBountiesFunding,
  waitForClaims } from './lib/changeBountyStateFunctions';

(async () => {
  const api = await createApi(9944);

  const SIGNERS = [aliceSigner(), bobSigner(), charlieSigner(), daveSigner(), eveSigner(), ferdieSigner()];

  const indexes = await proposeBounties(api, 6);

  await approveBounties(api, indexes);

  await waitForBountiesFunding(api, indexes);

  await proposeCurators(api, indexes, SIGNERS);

  await acceptCurators(api, indexes, SIGNERS);

  await awardBounties(api, indexes, SIGNERS);

  await waitForClaims(api, indexes);

  await claimBounties(api, indexes, SIGNERS);

  await api.disconnect();
})();
