// Copyright 2017-2022 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { BN } from '@polkadot/util';
import type { Token } from './types';

import { useEffect, useState } from 'react';

import { createNamedHook, useAccounts, useApi, useCall } from '@polkadot/react-hooks';

const QUERY_OPTS = { withParams: true };

const extractData = (optDetails: [BN[], Option<Token>]): Token | null => {
  const details = optDetails[1].unwrapOr(null);

  return details
    ? ({
        supply: details.supply,
        cap: details.cap,
        isFrozen: details.isFrozen,
        minimumBalance: details.minimumBalance,
        unitPrice: details.unitPrice,
        mintDeposit: details.mintDeposit,
        attributeCount: details.attributeCount
      } as Token)
    : null;
};

const useTokenDataImpl = (collection: BN, token: BN): Token | null => {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const details = useCall<[BN[], Option<Token>]>(api.query.multiTokens.tokens, [collection, token], QUERY_OPTS);
  const [state, setState] = useState<Token | null>(null);

  useEffect((): void => {
    if (details) {
      const data = extractData(details);
      setState(data);
    }
  }, [allAccounts, collection, token, details]);

  return state;
};

export default createNamedHook('useTokenData', useTokenDataImpl);
