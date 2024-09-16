// Copyright 2017-2024 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletBrokerSaleInfoRecord } from '@polkadot/types/lookup';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

function extractCurrentPrice (saleInfo: PalletBrokerSaleInfoRecord) {
  return saleInfo.toJSON()?.price?.toString();
}

function useCurrentPriceImpl () {
  const { api, isApiReady } = useApi();

  const saleInfo = useCall<PalletBrokerSaleInfoRecord>(isApiReady && api.query.broker.saleInfo);

  const [state, setState] = useState<string | undefined>();

  useEffect((): void => {
    saleInfo &&
      setState(
        extractCurrentPrice(saleInfo)
      );
  }, [saleInfo]);

  return state;
}

export const useCurrentPrice = createNamedHook('useCurrentPrice', useCurrentPriceImpl);
