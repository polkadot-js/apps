// Copyright 2017-2021 @polkadot/app-execute authors & contributors
// and @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ActionStatus } from '@canvas-ui/react-api/Status/types';
import { BareProps } from '@canvas-ui/react-components/types';
import { VoidFn } from '@canvas-ui/react-util/types';

import { AnyJson } from '@polkadot/types/types';

export interface AppNavigation {
  instantiate: VoidFn;
  instantiateAdd: VoidFn;
  instantiateNew: (_?: string, __?: number) => VoidFn;
  instantiateSuccess: (_: string) => VoidFn;
  execute: VoidFn;
  executeAdd: VoidFn;
  executeCall: (_: string, __?: number) => VoidFn;
  upload: VoidFn;
  uploadSuccess: (_: string) => VoidFn;
}

export interface AppPaths {
  instantiate: string;
  instantiateAdd: string;
  instantiateNew: (_?: string, __?: number) => string;
  instantiateSuccess: (_: string) => string;
  execute: string;
  executeAdd: string;
  executeCall: (_: string, __?: number) => string;
  upload: string;
  uploadSuccess: (_: string) => string;
}

export interface WithBasePath {
  basePath: string;
}

interface CodeBase {
  id: string;
  codeHash: string;
  name: string;
  genesisHash: string;
  tags: string[];
}

export interface Code extends CodeBase {
  abi?: AnyJson | null;
}

export interface WithCodes {
  allCodes: Code[];
  hasCodes: boolean;
  isLoading: boolean;
  updated: number;
}
