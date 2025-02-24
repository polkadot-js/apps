// Copyright 2017-2025 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ReactNode } from 'react';
import type { ApiPromise } from '@polkadot/api';
import type { BrokerStatus, PalletBrokerConfigRecord, PalletBrokerSaleInfoRecord } from '@polkadot/react-hooks/types';
import type { CurrentRegion } from './types.js';

import React, { createContext, useContext, useMemo } from 'react';

import { useBlockTime, useBrokerConfig, useBrokerSalesInfo, useBrokerStatus } from '@polkadot/react-hooks';
import { BN_ONE } from '@polkadot/util';

import { estimateTime } from './utils.js';

interface BrokerProviderProps {
  children: ReactNode;
  api: ApiPromise;
  isApiReady: boolean;
}

interface BrokerContextProps {
  config: PalletBrokerConfigRecord | null,
  coretimeConsts: {
    relay: {
      blockTimeMs: number | null
      blocksPerTimeslice: number | null
    }
  },
  currentRegion: CurrentRegion,
  saleInfo: PalletBrokerSaleInfoRecord | null,
  status: BrokerStatus | null,
}

const initialState = {
  config: null,
  coretimeConsts: {
    relay: {
      blockTimeMs: null,
      blocksPerTimeslice: null
    }
  },
  currentRegion: {
    begin: null,
    beginDate: null,
    end: null,
    endDate: null
  },
  saleInfo: null,
  status: null
};

export const BrokerContext = createContext<BrokerContextProps>(initialState);

export const BrokerProvider = ({ api, children, isApiReady }: BrokerProviderProps) => {
  const [blockTimeMs] = useBlockTime(BN_ONE, api);

  const coretimeConsts = useMemo(() => ({
    // on the relay chain
    // we cannot easily retrieve this information while on the coretime chain
    // it will change only very rarely
    relay: {
      blockTimeMs,
      blocksPerTimeslice: 80
    }
  }), [blockTimeMs]);

  console.log(coretimeConsts);

  const config = useBrokerConfig(api, isApiReady);
  const saleInfo = useBrokerSalesInfo(api, isApiReady);
  const status = useBrokerStatus(api, isApiReady);

  const currentRegionEnd = useMemo(() => saleInfo?.regionBegin, [saleInfo]);
  const currentRegionBegin = useMemo(() => saleInfo && config && saleInfo?.regionBegin - config?.regionLength, [saleInfo, config]);

  const currentRegionEndDate = useMemo(() => currentRegionEnd && status && estimateTime(
    Number(currentRegionEnd),
    status.lastTimeslice * coretimeConsts.relay.blocksPerTimeslice
  ), [currentRegionEnd, status, coretimeConsts]);

  const currentRegionBeginDate = useMemo(() => currentRegionBegin && status && estimateTime(
    Number(currentRegionBegin),
    status.lastTimeslice * coretimeConsts.relay.blocksPerTimeslice
  ), [currentRegionBegin, status, coretimeConsts]);

  const value = useMemo(() => {
    if (!config || !saleInfo || !status || !currentRegionBegin || !currentRegionBeginDate || !currentRegionEnd || !currentRegionEndDate) {
      return initialState;
    }

    return ({
      config,
      coretimeConsts,
      currentRegion: {
        begin: currentRegionBegin,
        beginDate: currentRegionBeginDate,
        end: currentRegionEnd,
        endDate: currentRegionEndDate
      },
      saleInfo,
      status
    });
  }, [currentRegionBegin, currentRegionEnd, currentRegionBeginDate, currentRegionEndDate, config, saleInfo, status, coretimeConsts]);

  return (
    <BrokerContext.Provider value={value}>
      {children}
    </BrokerContext.Provider>
  );
};

export const useBrokerContext = () => useContext(BrokerContext);
