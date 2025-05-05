// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CodeStored } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useIsMountedRef } from '@polkadot/react-hooks';

import store from './store.js';

interface UseCodes {
  allCodes: CodeStored[];
  codeTrigger: number;
}

const DEFAULT_STATE: UseCodes = { allCodes: [], codeTrigger: Date.now() };

function useCodesImpl (): UseCodes {
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<UseCodes>(DEFAULT_STATE);

  useEffect(
    (): void => {
      const triggerUpdate = (): void => {
        mountedRef.current && setState({
          allCodes: store.getAllCode(),
          codeTrigger: Date.now()
        });
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

export const useCodes = createNamedHook('useCodes', useCodesImpl);
