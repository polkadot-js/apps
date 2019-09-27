// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StorageEntryBase } from '@polkadot/api/types';
import { ModuleConstantMetadataV7 } from '@polkadot/types/interfaces';

export type StorageEntryPromise = StorageEntryBase<'promise', any>;

export interface ConstValueBase {
  method: string;
  section: string;
}

export interface ConstValue extends ConstValueBase {
  meta: ModuleConstantMetadataV7;
}
