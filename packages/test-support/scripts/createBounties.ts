// Copyright 2017-2020 @polkadot/test-support authors & contributors
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
  multiWaitForBountyState,
  multiWaitForClaim } from './lib/multiFunctions';

(async () => {
  const api = await createApi(9944);

  const SIGNERS = [aliceSigner(), bobSigner(), charlieSigner(), daveSigner(), eveSigner(), ferdieSigner()];

  const indexes = await multiProposeBounty(api, 6);

  await multiApproveBounty(api, indexes);

  await multiWaitForBountyState(api, indexes);

  await multiProposeCurator(api, indexes, SIGNERS);

  await multiAcceptCurator(api, indexes, SIGNERS);

  await multiAwardBounty(api, indexes, SIGNERS);

  await multiWaitForClaim(api, indexes);

  await multiClaimBounty(api, indexes, SIGNERS);

  await api.disconnect();
})();
