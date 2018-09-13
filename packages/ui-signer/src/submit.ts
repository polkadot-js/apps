// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { RxApiInterface } from '@polkadot/api-rx/types';
import { Param$Values, SectionItem } from '@polkadot/params/types';
import { Interfaces } from '@polkadot/jsonrpc/types';
import { QueueTx$Result } from './types';

import { format } from '@polkadot/util/logger';

export default async function submitMessage (api: RxApiInterface, params: Array<Param$Values>, { name, section }: SectionItem<Interfaces>): Promise<QueueTx$Result> {
  try {
    console.log(`submitMessage : ${section}.${name} :`, format(params));

    const result = await api[section][name].apply(null, params).toPromise();

    console.log(`${section}.${name}: result ::`, format(result));

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
