// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Method } from '@polkadot/jsonrpc/types';
import { RxApiInterface } from '@polkadot/api-rx/types';
import { QueueTx$Result } from './types';

import { format } from '@polkadot/util/logger';

export default async function submitMessage (api: RxApiInterface, params: Array<any>, { method, section }: Method): Promise<QueueTx$Result> {
  try {
    console.log(`submitMessage : ${section}.${method} :`, format(params));

    // @ts-ignore slowly driving me batty
    const result = await api[section][method].apply(null, params).toPromise();

    console.log(`${section}.${method}: result ::`, format(result));

    return {
      result,
      status: 'sent'
    };
  } catch (error) {
    console.error(error);

    return {
      error,
      status: 'error'
    };
  }
}
