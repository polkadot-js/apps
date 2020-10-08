// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ActionStatus } from '@canvas-ui/react-components/Status/types';
import { BareProps } from '@canvas-ui/react-components/types';
import { VoidFn } from '@canvas-ui/react-util/types';
import { AnyJson } from '@polkadot/types/types';

import { InkAbi } from '@canvas-ui/api-contract';

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

// export interface Code extends CodeBase {
//   abi: InkAbi | null;
// }

// export interface CodeStored {
//   id: string;
//   contractAbi?: InkAbi;
// }

export interface ContractJsonOld {
  genesisHash: string;
  abi: string;
  address: string;
  name: string;
}

export interface WithCodes {
  allCodes: Code[];
  hasCodes: boolean;
  updated: number;
}
