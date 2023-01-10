// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SortedJudgements } from '@polkadot/react-components/util/types';
import type { Judgement, Registrar } from '../types';

export function matchRegistrarAccountsWithIndexes (judgements: SortedJudgements, registrars: Registrar[]): Judgement[] {
  const findRegistrar = (index: number) => registrars.find((r) => r.index === index);

  return judgements.map(({ judgementName, registrarsIndexes }) => ({
    judgementName,
    registrars: registrarsIndexes.map((index) => findRegistrar(index.toNumber()))
  }));
}
