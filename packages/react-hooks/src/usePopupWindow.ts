// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

import { HorizontalPosition, VerticalPosition } from '@polkadot/react-components/Popup/types';
import { getPosition } from '@polkadot/react-components/Popup/utils';

import { useElementPosition } from './useElementPosition';
import { useScroll } from './useScroll';
import { useWindowSize } from './useWindowSize';

export function usePopupWindow (
  windowRef: React.RefObject<HTMLDivElement>,
  triggerRef: React.RefObject<HTMLDivElement>,
  position: HorizontalPosition
): {renderWindowPosition: {x: number, y: number} | undefined, verticalPosition: VerticalPosition | undefined} {
  const [renderWindowPosition, setRenderWindowPosition] = useState<{x: number, y: number}>();
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

  return { renderWindowPosition, verticalPosition };
}
