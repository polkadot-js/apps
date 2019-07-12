// Copyright 2017-2019 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StorageEntryPromise } from '@polkadot/api/types';
import { RawParams } from '@polkadot/ui-params/types';

interface IdQuery {
  id: number;
}

export interface PartialModuleQuery {
  key: StorageEntryPromise;
  params: RawParams;
}

export type StorageModuleQuery = PartialModuleQuery & IdQuery;

export interface PartialRawQuery {
  key: Uint8Array;
}

export type StorageRawQuery = PartialRawQuery & IdQuery;

export type QueryTypes = StorageModuleQuery | StorageRawQuery;

export type ParitalQueryTypes = PartialModuleQuery | PartialRawQuery;

export interface ComponentProps {
  onAdd: (query: ParitalQueryTypes) => void;
}
