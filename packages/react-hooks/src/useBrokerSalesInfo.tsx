// Copyright 2017-2024 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletBrokerSaleInfoRecord } from '@polkadot/types/lookup';
import type { PalletBrokerSaleInfoRecord as SimplifiedPalletBrokerSaleInfoRecord } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

import { stringToBN } from './utils/dataProcessing.js';

function parsePalletBrokerSaleInfoRecord (
  record: PalletBrokerSaleInfoRecord
): SimplifiedPalletBrokerSaleInfoRecord {
  const rec = record.toJSON();

  return {
    coresOffered: rec.coresOffered as number,
    coresSold: rec.coresSold as number,
    endPrice: stringToBN(rec.endPrice?.toString()),
    firstCore: rec.firstCore as number,
    idealCoresSold: rec.idealCoresSold as number,
    leadinLength: rec.leadinLength as number,
    regionBegin: rec.regionBegin as number,
    regionEnd: rec.regionEnd as number,
    saleStart: rec.saleStart as number,
    selloutPrice: stringToBN(rec.selloutPrice?.toString())
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
