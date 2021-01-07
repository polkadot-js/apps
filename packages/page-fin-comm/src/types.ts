// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountId, Hash } from '@polkadot/types/interfaces';

export interface ComponentProps {
  className?: string;
  isMember: boolean;
  prime?: AccountId | null;
  proposals?: Hash[];
  members: string[];
}
