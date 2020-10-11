// Copyright 2017-2020 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiTypes, DecorateMethod, ObsInnerType } from '@polkadot/api/types';
import { SubmittableExtrinsic } from '@polkadot/api/submittable/types';

import { AccountId, ContractExecResult } from '@polkadot/types/interfaces';
import { AnyJson, Codec, CodecArg, IKeyringPair } from '@polkadot/types/types';
import { ApiObject, AbiMessage, ContractCallOutcome } from '../types';

import BN from 'bn.js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubmittableResult } from '@polkadot/api';
import { assert, isFunction, isNumber } from '@polkadot/util';

import Abi from '../Abi';
import { formatData } from '../util';
import Base from './Base';

type ContractCallTypes = 'tx' | 'rpc';

type ContractCallResultSubscription<ApiType extends ApiTypes, CallType extends ContractCallTypes> = ApiType extends 'rxjs'
  // eslint-disable-next-line no-use-before-define
  ? Observable<ContractCallResult<CallType>>
  // eslint-disable-next-line no-use-before-define
  : Promise<ObsInnerType<ContractCallResult<CallType>>>;

export interface ContractRead<ApiType extends ApiTypes> {
  send (account: IKeyringPair | string | AccountId): ContractCallResultSubscription<ApiType, 'rpc'>;
}

export type ContractCallResult<CallType extends ContractCallTypes> = CallType extends 'rpc'
  ? Observable<ContractCallOutcome>
  : Observable<SubmittableResult>;

export default class Contract<ApiType extends ApiTypes> extends Base<ApiType> {
  public readonly address: AccountId;

  constructor (api: ApiObject<ApiType>, abi: AnyJson | Abi, decorateMethod: DecorateMethod<ApiType>, address: string | AccountId) {
    super(api, abi, decorateMethod);

    this.address = this.registry.createType('AccountId', address);
  }

  public get hasRpcContractsCall (): boolean {
    return isFunction(this.api.rx.rpc.contracts?.call);
  }

  private _createInput (message: AbiMessage | number, params: CodecArg[]): [Uint8Array, AbiMessage] {
    const fn = isNumber(message)
      ? this.abi.messages[message]
      : message;

    assert(fn, 'Attempted to call an invalid contract message');

    return [fn(...params), fn];
  }

  public exec = (message: AbiMessage | number, value: BN | string | number, gasLimit: BN | string | number, ...params: CodecArg[]): SubmittableExtrinsic<ApiType> => {
    const [inputData] = this._createInput(message, params);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore I give up
    return this.api.tx.contracts.call(this.address, value, gasLimit, inputData);
  }

  public read = (message: AbiMessage | number, value: BN | string | number, gasLimit: BN | string | number, ...params: CodecArg[]): ContractRead<ApiType> => {
    assert(this.hasRpcContractsCall, 'Your node does not support contract RPC read calls');

    const [inputData, messageFn] = this._createInput(message, params);

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      send: this._decorateMethod((account: IKeyringPair | string | AccountId): ContractCallResult<'rpc'> =>
        this.api.rx.rpc.contracts.call(
          this.registry.createType('ContractCallRequest', {
            dest: this.address,
            gasLimit,
            inputData,
            origin: account,
            value
          })
        ).pipe(
          map((result: ContractExecResult): ContractCallOutcome => {
            let output: Codec | null = null;

            if (result.isSuccess) {
              const { data } = result.asSuccess;

              output = messageFn.returnType
                ? formatData(this.registry, data as any, messageFn.returnType)
                : this.registry.createType('Raw', data);
            }

            return {
              isSuccess: result.isSuccess,
              message: messageFn,
              origin: this.registry.createType('AccountId', account),
              output,
              params,
              result,
              time: Date.now(),
              type: messageFn.returnType || null
            };
          })
        )
      )
    };
  }
}
