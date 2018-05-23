// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { RxApiInterface } from '@polkadot/api-rx/types';
import type { InterfaceMethodDefinition } from '@polkadot/jsonrpc/types';
import type { Param$Values } from '@polkadot/params/types';
import type { QueueTx$Result } from './types';

export default function submitMessage (api: RxApiInterface, params: Array<Param$Values>, rpc: InterfaceMethodDefinition): Promise<QueueTx$Result> {
  const { name, section } = rpc;

  // $FlowFixMe This should not be an issue...
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
      console.error(error);

      return {
        error,
        status: 'error'
      };
    });
}
