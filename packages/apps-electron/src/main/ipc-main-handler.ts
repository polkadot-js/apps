// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

export type IpcMainHandler = {
  [channel: string]: (...args: any[]) => Promise<void> | any
}
