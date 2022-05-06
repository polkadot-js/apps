// Copyright 2017-2022 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { BN } from '@polkadot/util';
import type { Attribute } from './types';

import { useEffect, useState } from 'react';

import { createNamedHook, useAccounts, useApi, useCall } from '@polkadot/react-hooks';

const QUERY_OPTS = { withParams: true };

const extractData = (optData: [BN[], Option<Attribute>]): Attribute | null => {
  const data = optData[1].unwrapOr(null);

  console.log({optData, data})
  return data ? {
    value: data.value,
    deposit: data.deposit
  } as Attribute : null;
}

const useAttributeDataImpl = (collection: BN, key: BN, token?: BN): Attribute | null => {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [state, setState] = useState<Attribute | null>(null);

  const result = useCall<[BN[], Option<Attribute>]>(api.query.multiTokens.attributes, [collection, token || '', key], {
    paramMap: (pms) => [pms[0], null, pms[2]],
    withParams: true
  });
  
  useEffect((): void => {
    if (result) {
      const data = extractData(result);
      // console.log({data})
      setState(data)
    }
  }, [allAccounts, collection, token, key, result]);

  return state;
};

export default createNamedHook('useAttributeData', useAttributeDataImpl);
