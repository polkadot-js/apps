// Copyright 2017-2021 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useMemo, useState } from 'react';

import store from './store';
import { WithCodes } from './types';

export default function useAppNavigation (): WithCodes {
  const [isLoading, setIsLoading] = useState(true);
  const [updated, setUpdated] = useState(0);
  const [allCodes, setAllCodes] = useState(store.getAllCode());

  const hasCodes = useMemo(
    (): boolean => allCodes.length > 0,
    [allCodes]
  );

  const _triggerUpdate = useCallback(
    (): void => {
      setUpdated(Date.now());
      setAllCodes(store.getAllCode());
    },
    []
  );

  useEffect(
    (): void => {
      store.on('new-code', _triggerUpdate);
      store.on('removed-code', _triggerUpdate);

      store.loadAll()
        .then((): void => {
          setAllCodes(store.getAllCode());
          setIsLoading(false);
        })
        .catch((): void => {
          // noop, handled internally
        });
    },
    [_triggerUpdate]
  );

  return {
    allCodes, hasCodes, isLoading, updated
  };
}
