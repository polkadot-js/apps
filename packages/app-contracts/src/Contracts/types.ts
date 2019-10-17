// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractABIMethod } from '@polkadot/api-contract/types';
import { BareProps, ContractDeployed as CallContract, I18nProps, StringOrNull } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';

import { RouteComponentProps } from 'react-router';
import { Abi } from '@polkadot/api-contract';

export interface CallProps extends BareProps, I18nProps, ApiProps, RouteComponentProps<{}> {
  callContract: CallContract | null;
  callMethodIndex: number | null;
  isOpen: boolean;
  onChangeCallContract: (callContract: CallContract) => void;
  onChangeCallMethodIndex: (callMethodIndex: number) => void;
  onClose: () => void;
}

export interface Contract {
  abi: Abi | null;
  address: StringOrNull;
  isValid: boolean;
}

export interface CallState {
  accountId: StringOrNull;
  contract: Contract;
  contractMethod: StringOrNull;
  isBusy: boolean;
  params: any[];
}

export type CallPropsArray = [StringOrNull, Abi | null, StringOrNull];
