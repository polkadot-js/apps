// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletBrokerScheduleItem, PolkadotRuntimeParachainsAssignerCoretimeCoreDescriptor } from '@polkadot/types/lookup';
import type { u32, u128 } from '@polkadot/types';

export interface CoreWorkloadInfo {
  core: number;
  info: PalletBrokerScheduleItem[];
}

export interface CoreWorkplanInfo {
  timeslice: number;
  core: number;
  info: PalletBrokerScheduleItem[];
}

export interface CoreDescription {
  core: number;
  info: PolkadotRuntimeParachainsAssignerCoretimeCoreDescriptor[];
}

export interface OnDemandQueueStatus {
  traffic: u128;
  nextIndex: u32;
  smallestIndex: u32;
  freedIndices: [string, u32][];
}
