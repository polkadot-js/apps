// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletVote } from '../../types.js';

import { createNamedHook } from '@polkadot/react-hooks';

import useSuperIds from './useSuperIds.js';
import useVotingFor from './useVotingFor.js';

function useActivityImpl (palletVote: PalletVote, accountIds?: string[] | null) {
  const identities = useSuperIds(accountIds);

  return useVotingFor(palletVote, identities);
}

export default createNamedHook('useActivity', useActivityImpl);
