// Copyright 2017-2024 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletBrokerSaleInfoRecord } from '@polkadot/types/lookup';
import type { PalletBrokerSaleInfoRecord as SimplifiedPalletBrokerSaleInfoRecord } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

import { stringToBN } from './utils/dataProcessing.js';

function parsePalletBrokerSaleInfoRecord (record: PalletBrokerSaleInfoRecord): SimplifiedPalletBrokerSaleInfoRecord {
  return {
    coresOffered: record.coresOffered.toNumber(),
    coresSold: record.coresSold.toNumber(),
    endPrice: stringToBN(record?.endPrice?.toString()),
    firstCore: record?.firstCore.toNumber(),
    idealCoresSold: record.idealCoresSold.toNumber(),
    leadinLength: record.leadinLength.toNumber(),
    regionBegin: record.regionBegin.toNumber(),
    regionEnd: record.regionEnd.toNumber(),
    saleStart: record.saleStart.toNumber(),
    selloutPrice: stringToBN(record.selloutPrice?.toString())
  };
}

function useBrokerSalesInfoImpl () {
  const { api, isApiReady } = useApi();

  const record = useCall<PalletBrokerSaleInfoRecord>(isApiReady && api.query.broker.saleInfo);

  const [state, setState] = useState<SimplifiedPalletBrokerSaleInfoRecord | undefined>();

  useEffect((): void => {
    !!record && !!record.toJSON() &&
      setState(
        parsePalletBrokerSaleInfoRecord(record)
      );
  }, [record]);

  return state;
}

export const useBrokerSalesInfo = createNamedHook('useBrokerSalesInfo', useBrokerSalesInfoImpl);
