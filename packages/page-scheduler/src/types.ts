// Copyright 2017-2025 @polkadot/app-scheduler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Bytes, Option } from '@polkadot/types';
import type { BlockNumber, Call, SchedulePeriod, SchedulePriority } from '@polkadot/types/interfaces';
import type { FrameSupportPreimagesBounded } from '@polkadot/types/lookup';

export interface ScheduledExt {
  blockNumber: BlockNumber;
  call: Call | null;
  key: string;
  maybeId: Option<Bytes>;
  maybePeriodic: Option<SchedulePeriod>;
  priority: SchedulePriority;
  preimageHash?: FrameSupportPreimagesBounded;
}
