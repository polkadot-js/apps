// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { RxApiInterface } from '@polkadot/api-rx/types';
import type { QueueTx$Result } from '../types';

import rpc from '@polkadot/jsonrpc';

const defaultRpc = rpc.author.methods.submitExtrinsic;

export default function submit (api: RxApiInterface, params: Array<mixed>, rpc?: InterfaceMethodDefinition = defaultRpc): Promise<QueueTx$Result> {
  const { name, section } = rpc;

  return api[section][name]
    .apply(null, params)
    .toPromise()
    .then((result) => {
      console.log(`${section}.${name}: result ::`, result);

      return {
        result,
        status: 'sent'
      };
    })
    .catch((error) => {
      console.error(`${section}.${name}: error ::`, error);

      return {
        result: null,
        status: 'error'
      };
    });
}
