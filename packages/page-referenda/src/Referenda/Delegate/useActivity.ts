// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletVote } from '../../types';
import type { VoteResult } from './types';

import { createNamedHook } from '@polkadot/react-hooks';

import useSuperIds from './useSuperIds';
import useVotingFor from './useVotingFor';

function useActivityImpl (palletVote: PalletVote, accountIds?: string[] | null): VoteResult | null | undefined {
  const identities = useSuperIds(accountIds);

  return useVotingFor(palletVote, identities);
}

export default createNamedHook('useActivity', useActivityImpl);
