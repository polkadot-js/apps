// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletVote } from '../../types.js';

import { createNamedHook } from '@polkadot/react-hooks';

import useActivity from './useActivity.js';
import useNominators from './useNominators.js';

function useActivityNominatorsImpl (palletVote: PalletVote) {
  const nominators = useNominators();

  return useActivity(palletVote, nominators);
}

export default createNamedHook('useActivityNominators', useActivityNominatorsImpl);
