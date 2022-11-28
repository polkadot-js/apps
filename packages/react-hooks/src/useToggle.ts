// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useMemo, useState } from 'react';

import { createNamedHook } from './createNamedHook';
import { useIsMountedRef } from './useIsMountedRef';

// Simple wrapper for a true/false toggle
function useToggleImpl (defaultValue = false, onToggle?: (isActive: boolean) => void): [boolean, () => void, (value: boolean) => void] {
  const mountedRef = useIsMountedRef();
  const [isActive, setActive] = useState(defaultValue);

  const _toggleActive = useCallback(
    (): void => {
      mountedRef.current && setActive((isActive) => !isActive);
    },
    [mountedRef]
  );

  const _setActive = useCallback(
    (isActive: boolean): void => {
      mountedRef.current && setActive(isActive);
    },
    [mountedRef]
  );

  useEffect(
    () => onToggle && onToggle(isActive),
    [isActive, onToggle]
  );

  return useMemo(
    () => [isActive, _toggleActive, _setActive],
    [isActive, _toggleActive, _setActive]
  );
}

export const useToggle = createNamedHook('useToggle', useToggleImpl);
