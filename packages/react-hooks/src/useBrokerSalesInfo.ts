// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Option } from '@polkadot/types';
import type { PalletBrokerSaleInfoRecord } from '@polkadot/types/lookup';
import type { PalletBrokerSaleInfoRecord as SimplifiedPalletBrokerSaleInfoRecord } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useCall } from '@polkadot/react-hooks';
import { BN } from '@polkadot/util';

function extractInfo (record: Option<PalletBrokerSaleInfoRecord>): SimplifiedPalletBrokerSaleInfoRecord {
  const v = record.unwrap();

  return {
    coresOffered: v.coresOffered?.toNumber(),
    coresSold: v.coresSold?.toNumber(),
    endPrice: v.endPrice,
    firstCore: v.firstCore?.toNumber(),
    idealCoresSold: v.idealCoresSold?.toNumber(),
    leadinLength: v.leadinLength?.toNumber(),
    regionBegin: v.regionBegin?.toNumber(),
    regionEnd: v.regionEnd?.toNumber(),
    saleStart: v.saleStart?.toNumber(),
    selloutPrice: v.selloutPrice?.isSome ? v.selloutPrice?.unwrap() : new BN(0)
  };
}

function useBrokerSalesInfoImpl (api: ApiPromise, ready: boolean) {
  const record = useCall<Option<PalletBrokerSaleInfoRecord>>(ready && api?.query.broker.saleInfo);

  const [state, setState] = useState<SimplifiedPalletBrokerSaleInfoRecord | undefined>();

  useEffect((): void => {
    !!record && !!record.isSome && !!record.toJSON() &&
      setState(
        extractInfo(record)
      );
  }, [record]);

  return state;
}

export const useBrokerSalesInfo = createNamedHook('useBrokerSalesInfo', useBrokerSalesInfoImpl);
