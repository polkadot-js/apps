// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { POINTER_OFFSET } from '@polkadot/react-components/Popup/PopupWindow';
import { HorizontalPosition, VerticalPosition } from '@polkadot/react-components/Popup/types';
import { ElementPosition } from '@polkadot/react-components/Popup/useElementPosition';

function getHorizontalOffset (windowPosition: ElementPosition, position: HorizontalPosition) {
  if (position === 'left') {
    return windowPosition.width - POINTER_OFFSET;
  }

  if (position === 'right') {
    return POINTER_OFFSET;
  }

  return (windowPosition.width / 2);
}

function getVerticalOffset (triggerPosition: ElementPosition, position: VerticalPosition, windowPosition: ElementPosition) {
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
