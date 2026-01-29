// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';

import { createNamedHook } from './createNamedHook.js';

function useScrollImpl (): number {
  const [scrollY, setScrollY] = useState(window.scrollY);
  const setYOffset = useCallback((): void => setScrollY(window.scrollY), []);

  useEffect(() => {
    function watchScroll () {
      window.addEventListener('scroll', setYOffset);
    }

    watchScroll();

    return () => {
      window.removeEventListener('scroll', setYOffset);
    };
  }, [setYOffset]);

  return scrollY;
}

export const useScroll = createNamedHook('useScroll', useScrollImpl);
