// Copyright 2017-2021 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Moved from @canvas-ui/apps -> page-contracts

import { AnyJson } from '@polkadot/types/types';



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
  isLoading: boolean;
  updated: number;
}
