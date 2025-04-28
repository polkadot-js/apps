// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ReactNode } from 'react';
import type { ApiPromise } from '@polkadot/api';
import type { CoretimeInformation } from '@polkadot/react-hooks/types';

import React, { createContext, useContext, useMemo } from 'react';

import { useCoretimeInformation } from '@polkadot/react-hooks';

import { createGet, estimateTime } from './utils/index.js';

interface CoretimeContextProps {
  coretimeInfo: CoretimeInformation | null;
  get: ReturnType<typeof createGet> | null;
  saleStartDate: string | null
  saleEndDate: string | null
  currentRegionEnd: number | null
  currentRegionStart: number | null
}

const initState = {
  coretimeInfo: null,
  currentRegionEnd: null,
  currentRegionStart: null,
  get: null,
  saleEndDate: null,
  saleStartDate: null
};

const CoretimeContext = createContext<CoretimeContextProps>(initState);

export const CoretimeProvider = ({ api,
  children,
  isApiReady }: {
  children: ReactNode;
  api: ApiPromise;
  isApiReady: boolean;
}) => {
  const coretimeInfo = useCoretimeInformation(api, isApiReady);
  const get = useMemo(() => {
    if (coretimeInfo?.constants) {
      return createGet(coretimeInfo.constants);
    }

    return null;
  }, [coretimeInfo?.constants]);

  const currentRegionEnd = useMemo(() => coretimeInfo ? coretimeInfo?.salesInfo.regionEnd - coretimeInfo?.config.regionLength : 0, [coretimeInfo]);
  const currentRegionStart = useMemo(() => coretimeInfo ? coretimeInfo.salesInfo.regionEnd - coretimeInfo?.config.regionLength * 2 : 0, [coretimeInfo]);

  const saleStartDate = useMemo(() => get && coretimeInfo && estimateTime(currentRegionStart, get.blocks.relay(coretimeInfo?.status?.lastTimeslice), coretimeInfo.constants.relay)?.formattedDate, [currentRegionStart, coretimeInfo, get]);
  const saleEndDate = useMemo(() => get && coretimeInfo && estimateTime(currentRegionEnd, get.blocks.relay(coretimeInfo?.status?.lastTimeslice), coretimeInfo.constants.relay)?.formattedDate, [currentRegionEnd, coretimeInfo, get]);

  const value = useMemo(() => {
    if (!coretimeInfo || !currentRegionEnd || !currentRegionStart || !get || !saleEndDate || !saleStartDate) {
      return initState;
    }

    return {
      coretimeInfo: coretimeInfo ?? null,
      currentRegionEnd,
      currentRegionStart,
      get,
      saleEndDate,
      saleStartDate
    };
  }, [coretimeInfo, currentRegionEnd, currentRegionStart, get, saleEndDate, saleStartDate]);

  return (
    <CoretimeContext.Provider value={value}>
      {children}
    </CoretimeContext.Provider>
  );
};

export const useCoretimeContext = () => useContext(CoretimeContext);
