<<<<<<< HEAD
// Copyright 2017-2021 @polkadot/app-tech-comm authors & contributors
=======
// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
>>>>>>> ternoa-master
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, Hash } from '@polkadot/types/interfaces';

export interface ComponentProps {
  className?: string;
  isMember: boolean;
  prime?: AccountId | null;
<<<<<<< HEAD
  proposalHashes?: Hash[];
  members: string[];
  type: 'membership' | 'financialCommittee';
=======
  proposals?: Hash[];
  members: string[];
>>>>>>> ternoa-master
}
