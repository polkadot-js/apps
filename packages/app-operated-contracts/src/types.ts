// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Abi } from '@polkadot/api-contract';
import { AppProps } from '@polkadot/react-components/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

// export interface LocationProps extends RouteComponentProps {}

export interface ComponentProps extends AppProps {
  accounts: SubjectInfo[];
  contracts: SubjectInfo[];
  hasCode: boolean;
  showDeploy: (codeHash?: string, constructorIndex?: number) => () => void;
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
  json: CodeJson;
  contractAbi?: Abi;
}

export interface ContractJsonOld {
  genesisHash: string;
  abi: string;
  address: string;
  name: string;
}
