// Copyright 2017-2018 @polkadot/ui-observable authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Observable } from 'rxjs';
import { defaultIfEmpty, map } from 'rxjs/operators';
import { BlockNumber, Header, SignedBlock } from '@polkadot/api-codec/index';

import ApiQueries from './Queries';

// Implementation of calls to API endpoints.
export default class ApiCalls extends ApiQueries {
  bestNumber = (): Observable<BlockNumber | undefined> => {
    return this
      .chainNewHead()
      .pipe(
        map((header?: Header): BlockNumber | undefined =>
          header && header.blockNumber
            ? header.blockNumber
            : undefined
        )
      );
  }

  chainGetBlock = (hash: Uint8Array): Observable<SignedBlock | undefined> => {
    return this.api.chain.getBlock(hash);
  }

  chainNewHead = (): Observable<Header | undefined> => {
    return this.api.chain.newHead().pipe(
      defaultIfEmpty()
    );
  }
}
