// Copyright 2017-2020 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiTypes, DecorateMethod, SignerOptions } from '@polkadot/api/types';
import { AccountId, Address, EventRecord, Hash } from '@polkadot/types/interfaces';
import { AnyJson, IKeyringPair, ISubmittableResult } from '@polkadot/types/types';
import { ApiObject } from '../types';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubmittableResult } from '@polkadot/api';
import { compactAddLength, u8aToU8a } from '@polkadot/util';

import Abi from '../Abi';
import Base from './Base';
import Blueprint from './Blueprint';
import { applyOnEvent } from './util';

// eslint-disable-next-line no-use-before-define
type CodePutCodeResultSubscription<ApiType extends ApiTypes> = Observable<CodePutCodeResult<ApiType>>;

export interface CodePutCode<ApiType extends ApiTypes> {
  signAndSend (account: IKeyringPair | string | AccountId | Address, options?: SignerOptions): CodePutCodeResultSubscription<ApiType>;
}

class CodePutCodeResult<ApiType extends ApiTypes> extends SubmittableResult {
  public readonly blueprint?: Blueprint<ApiType>;

  constructor (result: ISubmittableResult, blueprint?: Blueprint<ApiType>) {
    super(result);

    this.blueprint = blueprint;
  }
}

// NOTE Experimental, POC, bound to change
export default class Code<ApiType extends ApiTypes> extends Base<ApiType> {
  public readonly code: Uint8Array;

  constructor (api: ApiObject<ApiType>, abi: AnyJson | Abi, decorateMethod: DecorateMethod<ApiType>, wasm: Uint8Array | string) {
    super(api, abi, decorateMethod);

    this.code = u8aToU8a(wasm);
  }

  public createBlueprint = (): CodePutCode<ApiType> => {
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      signAndSend: this._decorateMethod(
        (account: IKeyringPair | string | AccountId, options?: SignerOptions): CodePutCodeResultSubscription<ApiType> =>
          this.api.rx.tx.contracts
            .putCode(compactAddLength(this.code))
            .signAndSend(account, options)
            .pipe(
              map((result) =>
                new CodePutCodeResult(result, applyOnEvent(result, 'CodeStored', (record: EventRecord) =>
                  new Blueprint<ApiType>(this.api, this.abi, this._decorateMethod, record.event.data[0] as Hash)
                ))
              )
            )
      )
    };
  }
}
