// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber, Call, SchedulePeriod, SchedulePriority } from '@polkadot/types/interfaces';

import { Bytes, Option } from '@polkadot/types';

export interface ScheduledExt {
  blockNumber: BlockNumber;
  call: Call;
  key: string;
  maybeId: Option<Bytes>;
  maybePeriodic: Option<SchedulePeriod>;
  priority: SchedulePriority;
}
