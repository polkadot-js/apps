// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { UseJudgements } from './types';

import { useMemo } from 'react';

import { getJudgements } from './utils/getJudgements';
import { matchRegistrarAccountsWithIndexes } from './utils/matchRegistrarAccountsWithIndexes';
import { useAccountInfo } from './useAccountInfo';
import { useRegistrars } from './useRegistrars';
import { createNamedHook } from './useNamedHook';

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
