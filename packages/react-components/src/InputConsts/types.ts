// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageEntryBase } from '@polkadot/api/types';
import type { ModuleConstantMetadataLatest } from '@polkadot/types/interfaces';

export type StorageEntryPromise = StorageEntryBase<'promise', any>;

export interface ConstValueBase {
  method: string;
  section: string;
}

export interface ConstValue extends ConstValueBase {
  meta: ModuleConstantMetadataLatest;
}
