// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoreWorkload, CoreWorkplan } from '@polkadot/react-hooks/types';

export interface InfoRow {
  taskId: string | null,
  maskBits: number,
  core: number
  mask?: string
  start?: string | null,
  end?: string | null
  owner?: string
  leaseLength?: number
  endBlock?: number
  type?: Occupancy
}

export interface CoreInfo {
  core: number,
  workload: CoreWorkload[],
  workplan: CoreWorkplan[]
}

export interface statsType {
  idles: number,
  pools: number,
  tasks: number
}

export enum Occupancy {
  'Reservation',
  'Lease',
  'Rent'
}
