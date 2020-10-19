// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { Abi } from '@polkadot/api-contract';

export interface CodeJson {
  abi?: string | null;
  codeHash: string;
  name: string;
  genesisHash: string;
  tags: string[];
}

export interface CodeStored {
  json: CodeJson;
  contractAbi?: Abi;
}

export interface ContractJsonOld {
  genesisHash: string;
  abi: string;
  address: string;
  name: string;
}

export interface UseWeight {
  executionTime: number;
  isValid: boolean;
  megaGas: BN;
  percentage: number;
  setMegaGas: React.Dispatch<BN | undefined>;
  weight: BN;
}
