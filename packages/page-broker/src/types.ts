// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
}
