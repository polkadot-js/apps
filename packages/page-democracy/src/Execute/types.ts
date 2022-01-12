// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Bytes, Option } from '@polkadot/types';
import type { BlockNumber, Call, SchedulePeriod, SchedulePriority } from '@polkadot/types/interfaces';

export interface ScheduledExt {
  blockNumber: BlockNumber;
  call: Call;
  key: string;
  maybeId: Option<Bytes>;
  maybePeriodic: Option<SchedulePeriod>;
  priority: SchedulePriority;
}
