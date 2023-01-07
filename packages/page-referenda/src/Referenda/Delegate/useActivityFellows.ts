// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletVote } from '../../types';
import type { Result } from './types';

import { createNamedHook } from '@polkadot/react-hooks';

import useActivity from './useActivity';
import useFellows from './useFellows';

function useActivityFellowsImpl (palletVote: PalletVote): Result | null | undefined {
  const fellows = useFellows();

  return useActivity(palletVote, fellows);
}

export default createNamedHook('useActivityFellows', useActivityFellowsImpl);
