// Copyright 2017-2024 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SortedJudgements } from '@polkadot/react-components/util/types';
import type { Judgement, Registrar } from '../types.js';

export function matchRegistrarAccountsWithIndexes (
  judgementsWithRegistrarIndexes: SortedJudgements,
  allRegistrars: Registrar[]
): Judgement[] {
  return judgementsWithRegistrarIndexes.map(({ judgementName, registrarsIndexes }) => {
    const findRegistrarByIndex = (index: number) => allRegistrars.find((registrar) => registrar.index === index);

    return {
      judgementName,
      registrars: registrarsIndexes.map((index) => findRegistrarByIndex(index.toNumber()))
    };
  });
}
