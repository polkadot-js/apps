// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { RegistrarIndex } from '@polkadot/types/interfaces/identity/types';

export type DisplayedJudgement = 'Erroneous' | 'Low quality' | 'Known good' | 'Reasonable';

export interface Registrar {
  address: string;
  index: number;
}

export interface Judgement {
  judgementName: DisplayedJudgement;
  registrars: (Registrar | undefined)[];
}

export type UseJudgements = Judgement[];

export interface SortedJudgement {
  judgementName: DisplayedJudgement,
  registrarsIndexes: RegistrarIndex[]
}

export type SortedJudgements = SortedJudgement[];
