// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';

// Simple wrapper for a true/false toggle
export default function useToggle (defaultValue = false, onToggle?: (isActive: boolean) => void): [boolean, () => void, (value: boolean) => void] {
  const [isActive, setActive] = useState(defaultValue);

  const toggleActive = useCallback(
    () => setActive((isActive: boolean) => !isActive),
    []
  );

  useEffect(
    () => onToggle && onToggle(isActive),
    [isActive, onToggle]
  );

  return [isActive, toggleActive, setActive];
}
