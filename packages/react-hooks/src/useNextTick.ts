// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { nextTick } from '@polkadot/util';

import { createNamedHook } from './createNamedHook.js';

function useNextTickImpl (): boolean {
  const [isNextTick, setIsNextTick] = useState(false);

  useEffect((): void => {
    nextTick(() => setIsNextTick(true));
  }, []);

  return isNextTick;
}

export const useNextTick = createNamedHook('useNextTick', useNextTickImpl);
