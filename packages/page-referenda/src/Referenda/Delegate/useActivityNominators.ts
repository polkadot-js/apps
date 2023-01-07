// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletVote } from '../../types';
import type { Result } from './types';

import { createNamedHook } from '@polkadot/react-hooks';

import useActivity from './useActivity';
import useNominators from './useNominators';

function useActivityNominatorsImpl (palletVote: PalletVote, accountId?: string | null): Result | null | undefined {
  const nominators = useNominators(accountId);

  return useActivity(palletVote, nominators);
}

export default createNamedHook('useActivityNominators', useActivityNominatorsImpl);
