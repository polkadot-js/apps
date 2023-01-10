// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

import { HorizontalPosition, VerticalPosition } from '@polkadot/react-components/Popup/types';
import { getPosition } from '@polkadot/react-components/Popup/utils';

import { createNamedHook } from './createNamedHook';
import { useElementPosition } from './useElementPosition';
import { useScroll } from './useScroll';
import { useWindowSize } from './useWindowSize';

interface Coord {
  x: number;
  y: number;
}

interface Result {
  pointerStyle: VerticalPosition;
  renderCoords: Coord;
}

const COORD_0: Coord = { x: 0, y: 0 };

function usePopupWindowImpl (windowRef: React.RefObject<HTMLDivElement>, triggerRef: React.RefObject<HTMLDivElement>, position: HorizontalPosition): Result {
  const [renderCoords, setRenderCoords] = useState<Coord>(COORD_0);
  const [pointerStyle, setPointerStyle] = useState<VerticalPosition>('top');
  const windowCoords = useElementPosition(windowRef);
  const triggerCoords = useElementPosition(triggerRef);
  const scrollY = useScroll();
  const windowSize = useWindowSize();

  useEffect(() => {
    if (windowSize && triggerCoords) {
      setPointerStyle((triggerCoords.y > windowSize.height / 2) ? 'top' : 'bottom');
    }
  }, [triggerCoords, windowSize]);

  useEffect(() => {
    if (windowCoords && triggerCoords) {
      setRenderCoords(getPosition(triggerCoords, position, pointerStyle, windowCoords, scrollY, windowSize));
    }
  }, [position, scrollY, triggerCoords, pointerStyle, windowCoords, windowSize]);

  return { pointerStyle, renderCoords };
}

export const usePopupWindow = createNamedHook('usePopupWindow', usePopupWindowImpl);
