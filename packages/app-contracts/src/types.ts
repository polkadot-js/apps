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

export type CodeJson = {
  abi?: string | null,
  codeHash: string,
  name: string
};

export type ContractJson = {
  abi: string,
  address: string,
  name: string
};
