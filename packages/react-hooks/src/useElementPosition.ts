// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

import { createNamedHook } from './createNamedHook.js';
import { useIsMountedRef } from './useIsMountedRef.js';
import { useScroll } from './useScroll.js';
import { useWindowSize } from './useWindowSize.js';

export interface ElementPosition {
  x: number,
  y: number,
  width: number,
  height: number,
}

function useElementPositionImpl (ref: React.MutableRefObject<HTMLElement | undefined | null>): ElementPosition | undefined {
  const [elementPosition, setElementPosition] = useState<ElementPosition>();
  const mountedRef = useIsMountedRef();
  const windowSize = useWindowSize();
  const scrollY = useScroll();

  useEffect(() => {
    if (mountedRef.current && ref && ref.current) {
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
