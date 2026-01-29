// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletVote } from '../../types.js';
import type { VoteResultItem } from './types.js';

import { useMemo } from 'react';

import { createNamedHook } from '@polkadot/react-hooks';

import useVotingFor from './useVotingFor.js';

function useActivityAccountImpl (palletVote: PalletVote, accountId?: string | null): VoteResultItem[] | null | undefined {
  const params = useMemo(
    () => (accountId && [accountId]) || null,
    [accountId]
  );
  const votingFor = useVotingFor(palletVote, params);

  // for a single account (which we assume is user-specified), we
  // do not lookup the actual parent identity, use as-is
  return votingFor && accountId
    ? votingFor[accountId] || []
    : null;
}

export default createNamedHook('useActivityAccount', useActivityAccountImpl);
