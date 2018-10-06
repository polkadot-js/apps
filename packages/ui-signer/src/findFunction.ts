// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ExtrinsicFunction } from '@polkadot/extrinsics/types';

import Api from '@polkadot/api-observable';

const FN_UNKNOWN = {
  method: 'unknown',
  section: 'unknown'
} as ExtrinsicFunction;

export default function findFunction (callIndex: Uint8Array): ExtrinsicFunction {
  const test = callIndex.toString();
  const found = ([] as Array<ExtrinsicFunction>)
    .concat(
      ...Object
        .keys(Api.extrinsics)
        .map((section) =>
          Object.values(Api.extrinsics[section])
        )
    )
    .find((fn) =>
      fn.callIndex.toString() === test
    );

  return found || FN_UNKNOWN;
}
