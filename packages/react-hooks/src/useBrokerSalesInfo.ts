// Copyright 2017-2024 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletBrokerSaleInfoRecord } from '@polkadot/types/lookup';
import type { PalletBrokerSaleInfoRecord as SimplifiedPalletBrokerSaleInfoRecord } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

import { stringToBN } from './utils/dataProcessing.js';

function parsePalletBrokerSaleInfoRecord (record: PalletBrokerSaleInfoRecord): SimplifiedPalletBrokerSaleInfoRecord {
  const rec = record?.toJSON();

  return {
    coresOffered: rec?.coresOffered as number || 0,
    coresSold: rec?.coresSold as number || 0,
    endPrice: stringToBN(rec?.endPrice?.toString()) || 0,
    firstCore: rec?.firstCore as number || 0,
    idealCoresSold: rec?.idealCoresSold as number || 0,
    leadinLength: rec?.leadinLength as number || 0,
    regionBegin: rec?.regionBegin as number || 0,
    regionEnd: rec?.regionEnd as number || 0,
    saleStart: rec?.saleStart as number || 0,
    selloutPrice: stringToBN(rec?.selloutPrice?.toString()) || 0
  };
}

function useBrokerSalesInfoImpl () {
  const { api, isApiReady } = useApi();

  const saleInfo = useCall<PalletBrokerSaleInfoRecord>(isApiReady && api.query.broker.saleInfo);

  const [state, setState] = useState<SimplifiedPalletBrokerSaleInfoRecord | undefined>();

  useEffect((): void => {
    saleInfo &&
      setState(
        parsePalletBrokerSaleInfoRecord(saleInfo)
      );
  }, [saleInfo]);

  return state;
}

export const useBrokerSalesInfo = createNamedHook('useBrokerSalesInfo', useBrokerSalesInfoImpl);
