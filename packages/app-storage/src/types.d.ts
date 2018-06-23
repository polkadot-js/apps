// Copyright 2017-2018 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Storage$Key } from '@polkadot/storage/types';
import { RawParams } from '@polkadot/ui-app/Params/types';

export type StorageQuery = {
  id: number,
  key: Storage$Key,
  params: RawParams
}
