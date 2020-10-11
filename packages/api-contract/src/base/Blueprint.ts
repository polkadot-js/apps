// Copyright 2017-2020 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiTypes, DecorateMethod, SignerOptions } from '@polkadot/api/types';
import { AccountId, EventRecord, Hash } from '@polkadot/types/interfaces';
import { AnyJson, IKeyringPair, ISubmittableResult } from '@polkadot/types/types';
import { ApiObject } from '../types';

import BN from 'bn.js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubmittableResult } from '@polkadot/api';
import { assert } from '@polkadot/util';

import Abi from '../Abi';
import Base from './Base';
import Contract from './Contract';
import { applyOnEvent } from './util';

// eslint-disable-next-line no-use-before-define
type BlueprintCreateResultSubscription<ApiType extends ApiTypes> = Observable<BlueprintCreateResult<ApiType>>;

export interface BlueprintCreate<ApiType extends ApiTypes> {
  signAndSend (account: IKeyringPair | string | AccountId, options?: SignerOptions): BlueprintCreateResultSubscription<ApiType>;
}

class BlueprintCreateResult<ApiType extends ApiTypes> extends SubmittableResult {
  public readonly contract?: Contract<ApiType>;

  constructor (result: ISubmittableResult, contract?: Contract<ApiType>) {
    super(result);

    this.contract = contract;
  }
}

// NOTE Experimental, POC, bound to change
export default class Blueprint<ApiType extends ApiTypes> extends Base<ApiType> {
  public readonly codeHash: Hash;

  constructor (api: ApiObject<ApiType>, abi: AnyJson | Abi, decorateMethod: DecorateMethod<ApiType>, codeHash: string | Hash) {
    super(api, abi, decorateMethod);

    this.codeHash = this.registry.createType('Hash', codeHash);
  }

  public deployContract (constructorIndex = 0, endowment: number | BN, maxGas: number | BN, ...params: any[]): BlueprintCreate<ApiType> {
    assert(!!this.abi.constructors[constructorIndex], `Specified constructor index ${constructorIndex} does not exist`);

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      signAndSend: this._decorateMethod(
        (account: IKeyringPair | string | AccountId, options?: SignerOptions): BlueprintCreateResultSubscription<ApiType> =>
          this.api.rx.tx.contracts
            .create(endowment, maxGas, this.codeHash, this.abi.constructors[constructorIndex](...params))
            .signAndSend(account, options)
            .pipe(
              map((result) =>
                new BlueprintCreateResult(result, applyOnEvent(result, 'Instantiated', (record: EventRecord) =>
                  new Contract<ApiType>(this.api, this.abi, this._decorateMethod, record.event.data[1] as AccountId)
                ))
              )
            )
      )
    };
  }
}
