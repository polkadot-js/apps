// Copyright 2017-2018 @polkadot/ui-observable authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { RxApiInterface, RxApiInterface$Method, RxApiInterface$Section } from '@polkadot/api-rx/types';
import { Method } from '@polkadot/jsonrpc/types';

import { Observable, combineLatest } from 'rxjs';
import { defaultIfEmpty, map } from 'rxjs/operators';
import { Vector } from '@polkadot/api-codec/codec';
import { StorageFunction } from '@polkadot/api-codec/StorageKey';
import assert from '@polkadot/util/assert';
import isUndefined from '@polkadot/util/is/undefined';

type MapFn<R, T> = (combined: R) => T;

const defaultMapFn = (result: any): any =>
  result;

// Raw base implementation for the observable API. It simply provides access to raw calls, allowing
// decendants to make direct queries to either API methods or actual storage
export default class ApiBase {
  protected api: RxApiInterface;

  constructor (api: RxApiInterface) {
    this.api = api;
  }

  protected combine = <T, R> (observables: Array<Observable<any>>, mapfn: MapFn<R, T> = defaultMapFn): Observable<T> => {
    return combineLatest(...observables).pipe(
      // FIXME There are a couple of places now where this casting happens after rxjs 6.3.2
      defaultIfEmpty([] as any),
      map(mapfn)
    );
  }

  isConnected = (): Observable<boolean> => {
    return this.api.isConnected();
  }

  rawCall = <T> ({ name, section }: Method, ...params: Array<any>): Observable<T> => {
    const apiSection = this.api[section as keyof RxApiInterface] as RxApiInterface$Section;

    assert(apiSection, `Unable to find 'api.${section}'`);

    const fn: RxApiInterface$Method = apiSection[name];

    assert(fn, `Unable to find 'api.${section}.${name}'`);

    return fn.apply(null, params);
  }

  rawStorage = <T> (key: StorageFunction, ...params: Array<any>): Observable<T | undefined> => {
    return this
      .rawStorageMulti([key, ...params] as [StorageFunction, any])
      .pipe(
        // @ts-ignore After upgrade to 6.3.2
        map((result: Array<T>): T | undefined =>
          result
            ? result[0] as T
            : undefined
        )
      );
  }

  rawStorageMulti = <T extends []> (...keys: Array<[StorageFunction] | [StorageFunction, any]>): Observable<T> => {
    try {
      return this.api.state
        .storage(keys)
        .pipe(
          map((result?: Vector<any>): T =>
            isUndefined(result)
              ? [] as T
              // FIXME When Vector extends Array, this mapping can be removed
              : result.map((item: any) => item) as T
          )
        );
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}
