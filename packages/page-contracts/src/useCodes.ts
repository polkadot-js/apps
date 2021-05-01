// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CodeStored } from './types';

import { useEffect, useState } from 'react';

import { useIsMountedRef } from '@polkadot/react-hooks';

import store from './store';

interface UseCodes {
  allCodes: CodeStored[];
  codeTrigger: number;
}

const DEFAULT_STATE: UseCodes = { allCodes: [], codeTrigger: Date.now() };

export function useCodes (): UseCodes {
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<UseCodes>(DEFAULT_STATE);

  useEffect(
    (): void => {
      const triggerUpdate = (): void => {
        mountedRef.current &&
        setState({ allCodes: store.getAllCode(), codeTrigger: Date.now() });
      };

      store.on('new-code', triggerUpdate);
      store.on('removed-code', triggerUpdate);
      store.loadAll(triggerUpdate);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return state;
}
