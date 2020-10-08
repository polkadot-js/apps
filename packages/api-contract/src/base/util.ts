// Copyright 2017-2020 @polkadot/api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiTypes, DecorateMethod, DecoratedRpc, SubmittableModuleExtrinsics } from '@polkadot/api/types';
import { AnyJson, Registry } from '@polkadot/types/types';
import { RpcInterface } from '@polkadot/rpc-core/types';
import { ApiObject } from '../types';

import { assert, isFunction } from '@polkadot/util';
import InkAbi from '../InkAbi';

export abstract class Base<ApiType extends ApiTypes> {
  public readonly abi: InkAbi;

  public readonly api: ApiObject<ApiType>;

  public readonly registry: Registry;

  public readonly decorateMethod: DecorateMethod<ApiType>;

  constructor (api: ApiObject<ApiType>, abi: AnyJson | InkAbi, decorateMethod: DecorateMethod<ApiType>) {
    this.abi = abi instanceof InkAbi
      ? abi
      : new InkAbi(api.registry, abi);
    this.api = api;
    this.registry = api.registry;
    this.decorateMethod = decorateMethod;
  }
}

export abstract class BaseWithTx<ApiType extends ApiTypes> extends Base<ApiType> {
  protected get _apiContracts (): SubmittableModuleExtrinsics<'rxjs'> {
    return this.api.rx.tx.contracts;
  }

  constructor (api: ApiObject<ApiType>, abi: AnyJson | InkAbi, decorateMethod: DecorateMethod<ApiType>) {
    super(api, abi, decorateMethod);

    assert(this.api.rx.tx.contracts && this.api.rx.tx.contracts.putCode, 'You need to connect to a node with the contracts module, the metadata does not enable api.tx.contracts on this instance');
  }
}

export abstract class BaseWithTxAndRpcCall<ApiType extends ApiTypes> extends BaseWithTx<ApiType> {
  public get hasRpcContractsCall (): boolean {
    return isFunction(this.api.rx.rpc.contracts?.call);
  }

  protected get _rpcContractsCall (): DecoratedRpc<'rxjs', RpcInterface>['contracts']['call'] {
    assert(this.hasRpcContractsCall, 'You need to connect to a node with the contracts.call RPC method.');

    return this.api.rx.rpc.contracts.call;
  }
}
