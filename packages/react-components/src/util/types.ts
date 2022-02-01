// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { RegistrarIndex } from '@polkadot/types/interfaces/identity/types';

import { DisplayedJudgement } from '../types';

export interface DropdownOption {
  className?: string;
  key?: string;
  text: React.ReactNode;
  value: string;
}

export type DropdownOptions = DropdownOption[];
export type SortedJudgements = ({ judgementName: DisplayedJudgement, registrarsIndexes: RegistrarIndex[] })[];
