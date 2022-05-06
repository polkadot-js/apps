// Copyright 2017-2022 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { BN } from '@polkadot/util';
import type { Collection } from './types';

import { useEffect, useState } from 'react';

import { createNamedHook, useAccounts, useApi, useCall } from '@polkadot/react-hooks';

const QUERY_OPTS = { withParams: true };

const extractData = (optDetails: [BN[], Option<Collection>]): Collection | null => {
  const details = optDetails[1].unwrapOr(null);

  return details
    ? ({
        owner: details.owner,
        policy: details.policy,
        tokenCount: details.tokenCount,
        attributeCount: details.attributeCount
      } as Collection)
    : null;
};

const useCollectionDataImpl = (id: BN): Collection | null => {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const details = useCall<[BN[], Option<Collection>]>(api.query.multiTokens.collections, [id], QUERY_OPTS);
  const [state, setState] = useState<Collection | null>(null);

  useEffect((): void => {
    if (details) {
      const data = extractData(details);
      setState(data);
    }
  }, [allAccounts, id, details]);

  return state;
};

export default createNamedHook('useCollectionData', useCollectionDataImpl);
