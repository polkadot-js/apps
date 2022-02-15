// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

import { createNamedHook } from './createNamedHook';
import { useScroll } from './useScroll';
import { useWindowSize } from './useWindowSize';

export interface ElementPosition {
  x: number,
  y: number,
  width: number,
  height: number,
}

function useElementPositionImpl (ref: React.MutableRefObject<HTMLElement | undefined | null>): ElementPosition | undefined {
  const [elementPosition, setElementPosition] = useState<ElementPosition>();
  const windowSize = useWindowSize();
  const scrollY = useScroll();

  useEffect(() => {
    if (ref && ref.current) {
      const { height, width, x, y } = ref.current.getBoundingClientRect();

      setElementPosition({
        height,
        width,
        x,
        y
      });
    }
  }, [ref, scrollY, windowSize]);

  return elementPosition;
}

export const useElementPosition = createNamedHook('useElementPosition', useElementPositionImpl);
