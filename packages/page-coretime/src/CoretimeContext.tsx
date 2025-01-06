// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ReactNode } from 'react';
import type { ApiPromise } from '@polkadot/api';
import type { CoretimeInformation } from '@polkadot/react-hooks/types';

import React, { createContext, useContext, useMemo } from 'react';

import { useCoretimeInformation } from '@polkadot/react-hooks';

import { createGet } from './utils/index.js';

interface CoretimeContextProps {
  coretimeInfo: CoretimeInformation | null;
  get: ReturnType<typeof createGet> | null;
}

const CoretimeContext = createContext<CoretimeContextProps>({
  coretimeInfo: null,
  get: null
});

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

  const value = useMemo(() => ({ coretimeInfo: coretimeInfo ?? null, get }), [coretimeInfo, get]);

  return (
    <CoretimeContext.Provider value={value}>
      {children}
    </CoretimeContext.Provider>
  );
};

export const useCoretimeContext = () => useContext(CoretimeContext);
