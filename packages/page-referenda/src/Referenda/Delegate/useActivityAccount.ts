// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletVote } from '../../types';
import type { Result } from './types';

import { useMemo } from 'react';

import { createNamedHook } from '@polkadot/react-hooks';

import useVotingActivity from './useVotingLocks';

function useActivityAccountImpl (palletVote: PalletVote, accountId?: string | null): Result | null | undefined {
  const params = useMemo(
    () => accountId
      ? [accountId]
      : null,
    [accountId]
  );

  // for a single account (which we assume is user-specified), we
  // do not lookup the actual parent identity, use as-is
  return useVotingActivity(palletVote, params);
}

export default createNamedHook('useActivityAccount', useActivityAccountImpl);
