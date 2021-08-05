// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

import { useWindowSize } from '@polkadot/react-components/Popup/useWindowSize';

export interface ElementPosition {
  x: number,
  y: number,
  width: number,
  height: number
}

export function useElementPosition (ref: React.MutableRefObject<HTMLElement | undefined>): ElementPosition | undefined {
  const [elementPosition, setElementPosition] = useState<ElementPosition>();

  const windowSize = useWindowSize();

  useEffect(() => {
    if (ref && ref.current) {
      const { height, width, x, y } = ref.current?.getBoundingClientRect();

      setElementPosition({
        height,
        width,
        x: x + document.body.scrollLeft + (width / 2),
        y: y + document.body.scrollTop + (height / 2)
      });
    }
  }, [ref, windowSize]);

  return elementPosition;
}
