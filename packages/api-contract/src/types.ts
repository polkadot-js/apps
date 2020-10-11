// Copyright 2017-2020 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiTypes } from '@polkadot/api/types';
import { AccountId, Address, ContractExecResult } from '@polkadot/types/interfaces';
import { Codec, CodecArg, TypeDef } from '@polkadot/types/types';

import { ApiPromise, ApiRx } from '@polkadot/api';
import Abi from './Abi';

export type ApiObject<ApiType extends ApiTypes> = ApiType extends 'rxjs'
  ? ApiRx
  : ApiPromise;

export interface ContractBase<ApiType extends ApiTypes> {
  readonly abi: Abi;
  readonly api: ApiObject<ApiType>;

  getMessage: (name: string) => AbiMessage;
  messages: AbiMessage[];
}

export interface AbiMessageParam {
  name: string;
  type: TypeDef;
}

export interface AbiMessage {
  args: AbiMessageParam[];
  docs: string[];
  identifier: string;
  index: number;
  isConstructor?: boolean;
  isMutating?: boolean;
  isPayable?: boolean;
  returnType?: TypeDef | null;
  selector: string;

  (...args: CodecArg[]): Uint8Array;
}

export type AbiConstructor = AbiMessage;

export interface InterfaceContractCalls {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [index: string]: Function;
}

export interface InterfaceContract {
  readonly address: Address;
  readonly calls: InterfaceContractCalls;
}

export interface ContractCallOutcome {
  isSuccess: boolean;
  message: AbiMessage;
  origin: AccountId;
  output: Codec | null;
  params: any[];
  result: ContractExecResult;
  time: number;
  type: TypeDef | null;
}
