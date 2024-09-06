// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoreWorkloadInfo, CoreWorkplanInfo } from '@polkadot/react-hooks/types';

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
  workload: CoreWorkloadInfo[],
  workplan: CoreWorkplanInfo[]
}

export interface statsType {
  idles: number,
  pools: number,
  tasks: number
}


export type Reservation = {core: number, task: string, mask: number}
export type Lease = {core: number, task: string, mask: number}

export enum Occupancy {
  'Reservation',
  'Lease',
  'Rent'
}