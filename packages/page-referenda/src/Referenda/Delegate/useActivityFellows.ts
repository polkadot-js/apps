// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletVote } from '../../types.js';
import type { VoteResult } from './types.js';

import { createNamedHook } from '@polkadot/react-hooks';

import useActivity from './useActivity.js';
import useFellows from './useFellows.js';

function useActivityFellowsImpl (palletVote: PalletVote): VoteResult | null | undefined {
  const fellows = useFellows();

  return useActivity(palletVote, fellows);
}

export default createNamedHook('useActivityFellows', useActivityFellowsImpl);
