// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ElementPosition } from '@polkadot/react-hooks/useElementPosition';

import { POINTER_OFFSET } from './PopupWindow';
import { HorizontalPosition, VerticalPosition } from './types';

function getHorizontalOffset (windowPosition: ElementPosition, position: HorizontalPosition): number {
  if (position === 'left') {
    return windowPosition.width - POINTER_OFFSET;
  }

  if (position === 'right') {
    return POINTER_OFFSET;
  }

  return (windowPosition.width / 2);
}

function getVerticalOffset (triggerPosition: ElementPosition, position: VerticalPosition, windowPosition: ElementPosition): number {
  if (position === 'top') return (triggerPosition.height / 2 + windowPosition.height + POINTER_OFFSET) * -1;

  return triggerPosition.height / 2;
}

export function getPosition (
  triggerPosition: ElementPosition,
  positionX: HorizontalPosition,
  positionY: VerticalPosition,
  windowPosition?: ElementPosition
): {x: number, y: number} {
  if (!windowPosition) return { x: 0, y: 0 };

  return {
    x: triggerPosition.globalX - getHorizontalOffset(windowPosition, positionX),
    y: triggerPosition.globalY + getVerticalOffset(triggerPosition, positionY, windowPosition)
  };
}
