// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useMemo, useState } from 'react';

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
  renderWindowPosition?: Coord;
  verticalPosition: VerticalPosition | undefined
}

function usePopupWindowImpl (windowRef: React.RefObject<HTMLDivElement>, triggerRef: React.RefObject<HTMLDivElement>, position: HorizontalPosition): Result {
  const [renderWindowPosition, setRenderWindowPosition] = useState<Coord>();
  const [verticalPosition, setVerticalPosition] = useState<VerticalPosition>();
  const windowPosition = useElementPosition(windowRef);
  const triggerPosition = useElementPosition(triggerRef);

  const scrollY = useScroll();
  const windowSize = useWindowSize();

  useEffect(() => {
    if (windowSize && triggerPosition) {
      setVerticalPosition((triggerPosition.y > windowSize.height / 2) ? 'top' : 'bottom');
    }
  }, [triggerPosition, windowSize]);

  useEffect(() => {
    if (windowPosition && triggerPosition && verticalPosition) {
      setRenderWindowPosition(getPosition(triggerPosition, position, verticalPosition, windowPosition, scrollY, windowSize));
    }
  }, [position, scrollY, triggerPosition, verticalPosition, windowPosition, windowSize]);

  return useMemo(
    () => ({ renderWindowPosition, verticalPosition }),
    [renderWindowPosition, verticalPosition]
  );
}

export const usePopupWindow = createNamedHook('usePopupWindow', usePopupWindowImpl);
