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
    coretime: {
      blockTimeMs: number | null
      blocksPerTimeslice: number | null
    }
    relay: {
      blockTimeMs: number | null
      blocksPerTimeslice: number | null
    }
  },
  currentRegion: CurrentRegion,
  saleInfo: PalletBrokerSaleInfoRecord | null,
  status: BrokerStatus | null,
}

export const BrokerContext = createContext<BrokerContextProps>({
  config: null,
  coretimeConsts: {
    coretime: {
      blockTimeMs: null,
      blocksPerTimeslice: null
    },
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
});

export const BrokerProvider = ({ api, children, isApiReady }: BrokerProviderProps) => {
  const [blockTimeMs] = useBlockTime(BN_ONE, api);
  // on relay chain
  const blocksPerTimesliceRelay = 80;

  const coretimeConsts = useMemo(() => ({
    coretime: {
      blockTimeMs: 12000,
      blocksPerTimeslice: 40
    },
    relay: {
      blockTimeMs,
      blocksPerTimeslice: blocksPerTimesliceRelay
    }
  }), [blockTimeMs, blocksPerTimesliceRelay]);

  const config = useBrokerConfig(api, isApiReady);
  const saleInfo = useBrokerSalesInfo(api, isApiReady);
  const status = useBrokerStatus(api, isApiReady);

  const currentRegionEnd = useMemo(() => saleInfo?.regionBegin, [saleInfo]);
  const currentRegionBegin = useMemo(() => saleInfo && config && saleInfo?.regionBegin - config?.regionLength, [saleInfo, config]);

  const currentRegionEndDate = useMemo(() => currentRegionEnd && status && estimateTime(
    Number(currentRegionEnd),
    status.lastTimeslice * 80
  ), [currentRegionEnd, status]);

  const currentRegionBeginDate = useMemo(() => currentRegionBegin && status && estimateTime(
    Number(currentRegionBegin),
    status.lastTimeslice * 80
  ), [currentRegionBegin, status]);

  const value = useMemo(() => {
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
