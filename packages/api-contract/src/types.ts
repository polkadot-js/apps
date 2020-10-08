// Copyright 2017-2020 @canvas-ui/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiTypes, DecorateMethod } from '@polkadot/api/types';
import { AccountId, Address, ContractExecResult } from '@polkadot/types/interfaces';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Codec, CodecArg } from '@polkadot/types/types';
import { TypeDef } from '@polkadot/types/create/types';

import { ApiPromise, ApiRx } from '@polkadot/api';
import InkAbi from './InkAbi';

// I give up, too hard to untangle atm... and is basically deprecated
/* eslint-disable no-use-before-define */

export type TestContracts = 'flipper' | 'incrementer' | 'erc20' | 'delegator' | 'dns' | 'erc721' | 'multisigPlain';

export type ApiObject<ApiType extends ApiTypes> = ApiType extends 'rxjs'
  ? ApiRx
  : ApiPromise;

export interface ContractBase<ApiType extends ApiTypes> {
  readonly abi: InkAbi;
  readonly api: ApiObject<ApiType>;
  readonly decorateMethod: DecorateMethod<ApiType>;
  getMessage: (name: string) => InkMessage;
  messages: InkMessage[];
}

export interface InkType {
  displayName?: string;
  type: TypeDef;
}

export interface InkMessageParam {
  name: string;
  type: TypeDef;
}

export interface InkMessageBase {
  args: InkMessageParam[];
  docs: string[];
  identifier: string;
  selector: string;
  isConstructor?: boolean;
  (...args: CodecArg[]): Uint8Array;
}

export type InkConstructor = InkMessageBase;

export interface InkMessage extends InkMessageBase {
  mutates: boolean;
  payable: boolean;
  returnType: InkType | null;
}

export type InkConstructors = InkMessage[];

export type InkMessages = InkMessage[];

export interface InterfaceContractCalls {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [index: string]: Function;
}

export interface InterfaceContract {
  readonly address: Address;
  readonly calls: InterfaceContractCalls;
}

export interface ContractCallOutcome {
  time: number;
  result: ContractExecResult;
  origin: AccountId;
  output: Codec | null;
  params: any[];
  isSuccess: boolean;
  message: InkMessage;
  type: TypeDef | null;
}
