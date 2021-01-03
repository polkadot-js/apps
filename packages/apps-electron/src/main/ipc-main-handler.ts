// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

export type IpcMainHandler = {
  [channel: string]: (...args: any[]) => unknown
}
