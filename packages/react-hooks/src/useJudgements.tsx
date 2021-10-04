// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { getJudgements } from './utils/getJudgements';
import { matchRegistrarAccountsWithIndexes } from './utils/matchRegistrarAccountsWithIndexes';
import { UseJudgements } from './types';
import { useAccountInfo, useRegistrars } from './';

export function useJudgements (address: string): UseJudgements {
  const { identity } = useAccountInfo(address);
  const { registrars: allRegistrars } = useRegistrars();

  const judgementsWithRegistrarIndexes = useMemo(() => getJudgements(identity), [identity]);

  return useMemo(
    () => matchRegistrarAccountsWithIndexes(judgementsWithRegistrarIndexes, allRegistrars),
    [allRegistrars, judgementsWithRegistrarIndexes]
  );
}
