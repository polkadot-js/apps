// Copyright 2017-2022 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { BN } from '@polkadot/util';
import type { Attribute } from './types';

import { useEffect, useState } from 'react';

import { createNamedHook, useAccounts, useApi, useCall } from '@polkadot/react-hooks';

const extractData = (optData: [BN[], Option<Attribute>]): Attribute | null => {
  const data = optData[1].unwrapOr(null);
  return data
    ? ({
        value: data.value,
        deposit: data.deposit
      } as Attribute)
    : null;
};

const useAttributeDataImpl = (collectionId: BN, key?: BN, tokenId?: BN): Attribute | null => {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [state, setState] = useState<Attribute | null>(null);

  const result = useCall<[BN[], Option<Attribute>]>(api.query.multiTokens.attributes, [collectionId, tokenId || '', key || ''], {
    paramMap: (pms) => [pms[0], !pms[1] ? null : pms[1], pms[2]],
    withParams: true
  });

  useEffect((): void => {
    if (result) {
      const data = extractData(result);
      setState(data);
    }
  }, [allAccounts, collectionId, tokenId, key, result]);

  return state;
};

export default createNamedHook('useAttributeData', useAttributeDataImpl);
