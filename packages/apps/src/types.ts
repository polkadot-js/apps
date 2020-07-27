// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActionStatus } from '@canvas-ui/react-components/Status/types';
import { BareProps } from '@canvas-ui/react-components/types';
import { VoidFn } from '@canvas-ui/react-util/types';

import { Abi } from '@polkadot/api-contract';

export interface AppNavigation {
  deploy: VoidFn;
  deployNew: (_: string, __?: number) => VoidFn;
  deploySuccess: (_: string) => VoidFn;
  execute: VoidFn;
  executeAdd: VoidFn;
  executeCall: (_: string, __?: number) => VoidFn;
  upload: VoidFn;
  uploadAdd: VoidFn;
  uploadSuccess: (_: string) => VoidFn;
}

interface WithAppNavigation {
  navigateTo: AppNavigation;
}

export interface WithBasePath {
  basePath: string;
}

export interface ComponentProps extends BareProps, WithBasePath, WithAppNavigation {}

export interface AppProps extends BareProps, WithBasePath, WithAppNavigation {
  onStatusChange: (status: ActionStatus) => void;
}

export interface CodeJson {
  abi?: string | null;
  codeHash: string;
  name: string;
  genesisHash: string;
  tags: string[];
}

export interface CodeStored {
  id: string;
  json: CodeJson;
  contractAbi?: Abi;
}

export interface ContractJsonOld {
  genesisHash: string;
  abi: string;
  address: string;
  name: string;
}

export interface WithCodes {
  allCodes: CodeStored[];
  hasCodes: boolean;
  updated: number;
}
