// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps } from '@polkadot/ui-app/types';

export type LocationProps = {
  match: {
    params: { [index: string]: any }
  }
};

export type ComponentProps = AppProps & LocationProps;

type BaseInfo = {
  name: string,
  genesisHash: string
};

export type CodeJson = BaseInfo & {
  abi?: string | null,
  codeHash: string
};

export type ContractJson = BaseInfo & {
  abi: string,
  address: string
};
