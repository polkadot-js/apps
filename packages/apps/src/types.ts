// Copyright 2017-2020 @polkadot/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import { Abi } from '@polkadot/api-contract';
import { AppProps } from '@polkadot/react-components/types';

export interface ComponentProps extends AppProps {
  accounts: string[];
  contracts: string[];
  hasCode: boolean;
  onShowDeploy: (codeHash?: string, constructorIndex?: number) => () => void;
  updated: number;
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
