// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { UseJudgements } from '@polkadot/react-components/types';

import { useMemo } from 'react';

import { getJudgements } from './utils/getJudgements.js';
import { matchRegistrarAccountsWithIndexes } from './utils/matchRegistrarAccountsWithIndexes.js';
import { createNamedHook } from './createNamedHook.js';
import { useAccountInfo } from './useAccountInfo.js';
import { useRegistrars } from './useRegistrars.js';

function useJudgementsImpl (address: string): UseJudgements {
  const { identity } = useAccountInfo(address);
  const { registrars: allRegistrars } = useRegistrars();

  const judgementsWithRegistrarIndexes = useMemo(() => getJudgements(identity), [identity]);

  return useMemo(
    () => matchRegistrarAccountsWithIndexes(judgementsWithRegistrarIndexes, allRegistrars),
    [allRegistrars, judgementsWithRegistrarIndexes]
  );
}

export const useJudgements = createNamedHook('useJudgements', useJudgementsImpl);
