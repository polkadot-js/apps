// Copyright 2017-2020 @canvas-ui/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiTypes, DecorateMethod, ObsInnerType } from '@polkadot/api/types';
import { AccountId, Address, ContractExecResult } from '@polkadot/types/interfaces';
import { AnyJson, Codec, CodecArg, IKeyringPair } from '@polkadot/types/types';
import { ApiObject, ContractCallOutcome, InkMessage } from '../types';

import BN from 'bn.js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubmittableResult } from '@polkadot/api';
import { assert } from '@polkadot/util';

import InkAbi from '../InkAbi';
import { formatData } from '../util';
import { BaseWithTxAndRpcCall } from './util';

type ContractCallTypes = 'tx' | 'rpc';

type ContractCallResultSubscription<ApiType extends ApiTypes, CallType extends ContractCallTypes> = ApiType extends 'rxjs'
  // eslint-disable-next-line no-use-before-define
  ? Observable<ContractCallResult<CallType>>
  // eslint-disable-next-line no-use-before-define
  : Promise<ObsInnerType<ContractCallResult<CallType>>>;

export interface ContractCall<ApiType extends ApiTypes, CallType extends ContractCallTypes> {
  send (account: IKeyringPair | string | AccountId | Address): ContractCallResultSubscription<ApiType, CallType>;
}

export type ContractCallResult<CallType extends ContractCallTypes> = CallType extends 'rpc'
  ? Observable<ContractCallOutcome>
  : Observable<SubmittableResult>;

export default class Contract<ApiType extends ApiTypes> extends BaseWithTxAndRpcCall<ApiType> {
  public readonly address: Address;

  constructor (api: ApiObject<ApiType>, abi: AnyJson | InkAbi, decorateMethod: DecorateMethod<ApiType>, address: string | AccountId | Address) {
    super(api, abi, decorateMethod);

    this.address = this.registry.createType('Address', address);
  }

  public call (as: 'rpc', messageIndex: number, value: BN | number, gasLimit: BN | number, ...params: CodecArg[]): ContractCall<ApiType, 'rpc'>;
  public call (as: 'tx', messageIndex: number, value: BN | number, gasLimit: BN | number, ...params: CodecArg[]): ContractCall<ApiType, 'tx'>;
  public call<CallType extends ContractCallTypes> (as: CallType, messageIndex: number, value: BN | number, gasLimit: BN | number, ...params: CodecArg[]): ContractCall<ApiType, CallType> {
    assert(messageIndex < this.abi.messages.length, 'Attempted to call invalid contract message');

    const message = this.abi.messages[messageIndex];

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      send: this.decorateMethod(
        as === 'rpc' && this.hasRpcContractsCall
          ? (account: IKeyringPair | string | AccountId | Address): ContractCallResult<'rpc'> =>
            this._rpcContractsCall(
              this.registry.createType('ContractCallRequest', {
                dest: this.address.toString(),
                gasLimit,
                inputData: message(...params),
                origin: account,
                value
              })
            ).pipe(map((result: ContractExecResult): ContractCallOutcome =>
              this._createOutcome(result, this.registry.createType('AccountId', account), message, params)
            ))
          : (account: IKeyringPair | string | AccountId | Address): ContractCallResult<'tx'> =>
            this._apiContracts
              .call(this.address, value, gasLimit, message(...params))
              .signAndSend(account)
      )
    };
  }

  private _createOutcome (result: ContractExecResult, origin: AccountId, message: InkMessage, params: CodecArg[]): ContractCallOutcome {
    let output: Codec | null = null;

    if (result.isSuccess) {
      const { data } = result.asSuccess;

      output = message.returnType
        ? formatData(this.registry, data, message.returnType.type)
        : this.registry.createType('Raw', data);
    }

    return {
      isSuccess: result.isSuccess,
      message,
      origin,
      output,
      params,
      result,
      time: Date.now(),
      type: message.returnType?.type || null
    };
  }
}
