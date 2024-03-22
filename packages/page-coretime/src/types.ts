// Copyright 2017-2024 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletBrokerScheduleItem } from '@polkadot/types/lookup';

export interface WorkloadInfo {
  core: number;
  info: PalletBrokerScheduleItem[]
}

export interface CoreWorkloadInfo {
  core: number;
  info: PalletBrokerScheduleItem[];
}
