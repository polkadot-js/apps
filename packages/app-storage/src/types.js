// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Storage$Key } from '@polkadot/storage/types';

export type StorageQuery = {
  id: number,
  key: Storage$Key,
  // flowlint-next-line unclear-type:off
  params: Array<any>
}
