// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { WithCodes } from './types';

import { useCallback, useEffect, useMemo, useState } from 'react';
import store from './store';

export default function useAppNavigation (): WithCodes {
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
        .then((): void => setAllCodes(store.getAllCode()))
        .catch((): void => {
          // noop, handled internally
        });
    },
    [_triggerUpdate]
  );

  return {
    allCodes, hasCodes, updated
  };
}
