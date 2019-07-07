// Copyright 2017-2019 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StorageEntry } from '@polkadot/types/primitive/StorageKey';
import { RawParams } from '@polkadot/ui-params/types';

type IdQuery = {
  id: number
};

export type PartialModuleQuery = {
  key: StorageEntry,
  params: RawParams
};

export type StorageModuleQuery = PartialModuleQuery & IdQuery;

export type PartialRawQuery = {
  key: Uint8Array
};

export type StorageRawQuery = PartialRawQuery & IdQuery;

export type QueryTypes = StorageModuleQuery | StorageRawQuery;

export type ParitalQueryTypes = PartialModuleQuery | PartialRawQuery;

export type ComponentProps = {
  onAdd: (query: ParitalQueryTypes) => void
};
