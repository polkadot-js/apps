// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

import { useScroll } from './useScroll';
import { useWindowSize } from './useWindowSize';

export interface ElementPosition {
  globalX: number,
  globalY: number,
  x: number,
  y: number,
  width: number,
  height: number,
  verticalPosition: 'bottom' | 'top'
}

export function useElementPosition (ref: React.MutableRefObject<HTMLElement | undefined | null>): ElementPosition | undefined {
  const [elementPosition, setElementPosition] = useState<ElementPosition>();
  const windowSize = useWindowSize();
  const scrollY = useScroll();

  useEffect(() => {
    if (ref && ref.current) {
      const { height, width, x, y } = ref.current?.getBoundingClientRect();

      setElementPosition({
        globalX: x + (width / 2),
        globalY: y + scrollY + (height / 2),
        height,
        verticalPosition: windowSize ? (y > windowSize.height / 2) ? 'top' : 'bottom' : 'bottom',
        width,
        x,
        y
      });
    }
  }, [ref, windowSize, scrollY]);

  return elementPosition;
}
