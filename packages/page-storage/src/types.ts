// Copyright 2017-2020 @polkadot/app-storage authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { QueryableStorageEntry } from '@polkadot/api/types';
import { ConstValue } from '@polkadot/react-components/InputConsts/types';
import { RawParams } from '@polkadot/react-params/types';

interface Base {
  isConst: boolean;
}

interface IdQuery extends Base {
  id: number;
}

export interface PartialModuleQuery extends Base {
  key: QueryableStorageEntry<'promise'>;
  params: RawParams;
}

export type StorageModuleQuery = PartialModuleQuery & IdQuery;

export interface PartialRawQuery extends Base {
  key: Uint8Array;
}

export type StorageRawQuery = PartialRawQuery & IdQuery;

export interface PartialConstQuery extends Base {
  key: ConstValue;
}

export type ConstQuery = PartialConstQuery & IdQuery;

export type QueryTypes = StorageModuleQuery | StorageRawQuery | ConstQuery;

export type ParitalQueryTypes = PartialModuleQuery | PartialRawQuery | PartialConstQuery;

export interface ComponentProps {
  onAdd: (query: ParitalQueryTypes) => void;
}
