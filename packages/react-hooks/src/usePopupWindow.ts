// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';
import type { HorizontalPosition, VerticalPosition } from '@polkadot/react-components/Popup/types';

import { useEffect, useMemo, useState } from 'react';

import { getPosition } from '@polkadot/react-components/Popup/utils';

import { createNamedHook } from './createNamedHook.js';
import { useElementPosition } from './useElementPosition.js';
import { useScroll } from './useScroll.js';
import { useWindowSize } from './useWindowSize.js';

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

  return useMemo(
    () => ({ pointerStyle, renderCoords }),
    [renderCoords, pointerStyle]
  );
}

export const usePopupWindow = createNamedHook('usePopupWindow', usePopupWindowImpl);
