// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Abi } from '@polkadot/api-contract';
import { AppProps } from '@polkadot/ui-app/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

export type LocationProps = {
  match: {
    params: { [index: string]: any }
  }
};

export type ComponentProps = AppProps & LocationProps & {
  accounts: SubjectInfo[],
  contracts: SubjectInfo[],
  hasCode: boolean,
  showDeploy: (codeHash?: string) => () => void
};

export type CodeJson = {
  abi?: string | null,
  codeHash: string
  name: string,
  genesisHash: string,
  tags: Array<string>
};

export type CodeStored = { json: CodeJson , contractAbi?: Abi };

export type ContractJsonOld = {
  genesisHash: string,
  abi: string,
  address: string,
  name: string
};
