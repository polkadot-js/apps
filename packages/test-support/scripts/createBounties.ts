// Copyright 2017-2021 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createApi } from '@polkadot/test-support/api';
import { aliceSigner,
  bobSigner,
  charlieSigner,
  daveSigner,
  eveSigner,
  ferdieSigner } from '@polkadot/test-support/keyring';

import { multiAcceptCurator,
  multiApproveBounty,
  multiAwardBounty,
  multiClaimBounty,
  multiProposeBounty,
  multiProposeCurator,
  multiWaitForBountyFunded,
  multiWaitForClaim } from './lib/multiFunctions';

(async () => {
  const api = await createApi(9944);

  const SIGNERS = [aliceSigner(), bobSigner(), charlieSigner(), daveSigner(), eveSigner(), ferdieSigner()];

  const indexes = await multiProposeBounty(api, 6);

  indexes.pop();
  await multiApproveBounty(api, indexes);

  await multiWaitForBountyFunded(api, indexes);

  indexes.pop();
  await multiProposeCurator(api, indexes, SIGNERS);

  indexes.pop();
  await multiAcceptCurator(api, indexes, SIGNERS);

  indexes.pop();
  await multiAwardBounty(api, indexes, SIGNERS);

  await multiWaitForClaim(api, indexes);

  indexes.pop();
  await multiClaimBounty(api, indexes, SIGNERS);

  await api.disconnect();
})().catch((err) => console.error(err));
