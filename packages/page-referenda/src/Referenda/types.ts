// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

export interface VoteTypeProps {
  accountId: string | null;
  id: BN | number;
  isAye?: boolean;
  onChange: (params: unknown[]) => void;
}
