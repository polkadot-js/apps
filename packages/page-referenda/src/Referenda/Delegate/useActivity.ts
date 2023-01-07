// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletVote } from '../../types';
import type { Result } from './types';

import { createNamedHook } from '@polkadot/react-hooks';

import useSuperIds from './useSuperIds';
import useVotingActivity from './useVotingLocks';

function useActivityImpl (palletVote: PalletVote, accountIds?: string[] | null): Result | null | undefined {
  const identities = useSuperIds(accountIds);

  return useVotingActivity(palletVote, identities);
}

export default createNamedHook('useActivity', useActivityImpl);
