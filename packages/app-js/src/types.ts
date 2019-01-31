// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export type LogType = 'error' | 'log';

export type Log = {
  args: Array<any>,
  type: LogType
};
