// Copyright 2017-2020 @canvas-ui/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiTypes, DecorateMethod } from '@polkadot/api/types';
import { AccountId, Address, Hash } from '@polkadot/types/interfaces';
import { AnyJson, IKeyringPair, ISubmittableResult } from '@polkadot/types/types';
import { ApiObject } from '../types';

import BN from 'bn.js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubmittableResult } from '@polkadot/api';
import { assert } from '@polkadot/util';

import InkAbi from '../InkAbi';
import Contract from './Contract';
import { BaseWithTx } from './util';

// eslint-disable-next-line no-use-before-define
type BlueprintCreateResultSubscription<ApiType extends ApiTypes> = Observable<BlueprintCreateResult<ApiType>>;

export interface BlueprintCreate<ApiType extends ApiTypes> {
  signAndSend (account: IKeyringPair | string | AccountId | Address): BlueprintCreateResultSubscription<ApiType>;
}

class BlueprintCreateResult<ApiType extends ApiTypes> extends SubmittableResult {
  public readonly contract?: Contract<ApiType>;

  constructor (result: ISubmittableResult, contract?: Contract<ApiType>) {
    super(result);

    this.contract = contract;
  }
}

// NOTE Experimental, POC, bound to change
export default class Blueprint<ApiType extends ApiTypes> extends BaseWithTx<ApiType> {
  public readonly codeHash: Hash;

  constructor (api: ApiObject<ApiType>, abi: AnyJson | InkAbi, decorateMethod: DecorateMethod<ApiType>, codeHash: string | Hash) {
    super(api, abi, decorateMethod);

    this.codeHash = this.api.registry.createType('Hash', codeHash);
  }

  public deployContract (constructorIndex = 0, endowment: number | BN, maxGas: number | BN, ...params: any[]): BlueprintCreate<ApiType> {
    assert(!!this.abi.constructors[constructorIndex], `Specified constructor index ${constructorIndex} does not exist`);

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      signAndSend: this.decorateMethod(
        (account: IKeyringPair | string | AccountId | Address): BlueprintCreateResultSubscription<ApiType> => {
          return this._apiContracts
            .create(endowment, maxGas, this.codeHash, this.abi.constructors[constructorIndex](...params))
            .signAndSend(account)
            .pipe(map(this._createResult));
        }
      )
    };
  }

  private _createResult = (result: SubmittableResult): BlueprintCreateResult<ApiType> => {
    let contract: Contract<ApiType> | undefined;

    if (result.isInBlock) {
      const record = result.findRecord('contract', 'Instantiated');

      if (record) {
        contract = new Contract<ApiType>(this.api, this.abi, this.decorateMethod, record.event.data[1] as Address);
      }
    }

    return new BlueprintCreateResult(result, contract);
  }
}
