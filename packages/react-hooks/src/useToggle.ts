// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useState } from 'react';

// Simple wrapper for a true/false toggle
export default function useToggle (defaultValue = false): [boolean, () => void, (value: boolean) => void] {
  const [isActive, setActive] = useState(defaultValue);
  const toggleActive = useCallback(
    (): void => setActive((isActive: boolean) => !isActive),
    []
  );

  return [isActive, toggleActive, setActive];
}
