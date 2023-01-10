// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';

import { createNamedHook } from './createNamedHook';
import { useIsMountedRef } from './useIsMountedRef';

// Simple wrapper for a true/false toggle
function useToggleImpl (defaultValue = false, onToggle?: (isActive: boolean) => void): [boolean, () => void, (value: boolean) => void] {
  const mountedRef = useIsMountedRef();
  const [isActive, setIsActive] = useState(defaultValue);

  const toggleActive = useCallback(
    (): void => {
      mountedRef.current && setIsActive((isActive) => !isActive);
    },
    [mountedRef]
  );

  const setActive = useCallback(
    (isActive: boolean): void => {
      mountedRef.current && setActive(isActive);
    },
    [mountedRef]
  );

  useEffect(
    () => onToggle && onToggle(isActive),
    [isActive, onToggle]
  );

  return [isActive, toggleActive, setActive];
}

export const useToggle = createNamedHook('useToggle', useToggleImpl);
