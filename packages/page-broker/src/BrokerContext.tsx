// Copyright 2017-2025 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ReactNode } from 'react';
import type { ApiPromise } from '@polkadot/api';
import type { BrokerStatus, ChainConstants, PalletBrokerConfigRecord, PalletBrokerSaleInfoRecord } from '@polkadot/react-hooks/types';
import type { CurrentRegion } from './types.js';

import React, { createContext, useContext, useMemo } from 'react';

import { useBrokerConfig, useBrokerSalesInfo, useBrokerStatus, useCoretimeConsts } from '@polkadot/react-hooks';

import { estimateTime } from './utils.js';

interface BrokerProviderProps {
  children: ReactNode;
  api: ApiPromise;
  isApiReady: boolean;
}

interface BrokerContextProps {
  config: PalletBrokerConfigRecord | null,
  coretimeConsts: ChainConstants | null,
  currentRegion: CurrentRegion,
  saleInfo: PalletBrokerSaleInfoRecord | null,
  status: BrokerStatus | null,
}

const initialState = {
  config: null,
  coretimeConsts: null,
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
  const coretimeConsts = useCoretimeConsts();
  const config = useBrokerConfig(api, isApiReady);
  const saleInfo = useBrokerSalesInfo(api, isApiReady);
  const status = useBrokerStatus(api, isApiReady);

  const currentRegionEnd = useMemo(() => saleInfo?.regionBegin, [saleInfo]);
  const currentRegionBegin = useMemo(() => saleInfo && config && saleInfo?.regionBegin - config?.regionLength, [saleInfo, config]);
  const lastBlock = useMemo(() => status && coretimeConsts && status.lastTimeslice * coretimeConsts.relay.blocksPerTimeslice, [status, coretimeConsts]);

  const currentRegionEndDate = useMemo(() => currentRegionEnd && lastBlock && estimateTime(Number(currentRegionEnd), lastBlock)?.formattedDate, [currentRegionEnd, lastBlock]);
  const currentRegionBeginDate = useMemo(() => currentRegionBegin && lastBlock && estimateTime(Number(currentRegionBegin), lastBlock)?.formattedDate, [currentRegionBegin, lastBlock]);

  const value = useMemo(() => {
    if (!config || !saleInfo || !status || !currentRegionBegin || !currentRegionBeginDate || !currentRegionEnd || !currentRegionEndDate || !coretimeConsts) {
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
