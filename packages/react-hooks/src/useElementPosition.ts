// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';
import type { ElementPosition } from '@polkadot/react-components/Popup/types';

import { useEffect, useState } from 'react';

import { createNamedHook } from './createNamedHook.js';
import { useIsMountedRef } from './useIsMountedRef.js';
import { useScroll } from './useScroll.js';
import { useWindowSize } from './useWindowSize.js';

function useElementPositionImpl (ref: React.MutableRefObject<HTMLElement | undefined | null>): ElementPosition | undefined {
  const [elementPosition, setElementPosition] = useState<ElementPosition>();
  const mountedRef = useIsMountedRef();
  const windowSize = useWindowSize();
  const scrollY = useScroll();

  useEffect(() => {
    if (mountedRef.current && ref?.current) {
      const { height, width, x, y } = ref.current.getBoundingClientRect();

      setElementPosition({
        height,
        width,
        x,
        y
      });
    }
  }, [mountedRef, ref, scrollY, windowSize]);

  return elementPosition;
}

export const useElementPosition = createNamedHook('useElementPosition', useElementPositionImpl);
