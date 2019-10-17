// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WithTranslation } from 'react-i18next';
import { Abi } from '@polkadot/api-contract';
import { ActionStatus } from '@polkadot/react-components/Status/types';

export interface BareProps {
  className?: string;
  style?: Record<string, string | number>;
}

export interface AppProps {
  basePath: string;
  onStatusChange: (status: ActionStatus) => void;
}

export type I18nProps = BareProps & WithTranslation;

export type BitLength = 8 | 16 | 32 | 64 | 128 | 256;

export type StringOrNull = string | null;

interface ContractBase {
  abi: Abi;
}

export interface Contract extends ContractBase {
  address: null;
}

export interface ContractDeployed extends ContractBase {
  address: string;
}

export type CallContract = ContractDeployed;

export interface NullContract {
  abi: null;
  address: null;
}
