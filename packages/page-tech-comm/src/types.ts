// Copyright 2017-2021 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, Hash } from '@polkadot/types/interfaces';

export interface ComponentProps {
  className?: string;
  isMember: boolean;
  prime?: AccountId | null;
  proposalHashes?: Hash[];
  members: string[];
  type: 'membership' | 'technicalCommittee';
}
