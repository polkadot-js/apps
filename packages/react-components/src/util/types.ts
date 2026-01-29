// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';
import type { RegistrarIndex } from '@polkadot/types/interfaces/identity/types';
import type { DisplayedJudgement } from '../types.js';

export interface DropdownOption {
  className?: string;
  key?: string;
  text: React.ReactNode;
  value: string;
}

export type DropdownOptions = DropdownOption[];
export type SortedJudgements = ({ judgementName: DisplayedJudgement, registrarsIndexes: RegistrarIndex[] })[];
