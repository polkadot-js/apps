// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ElementPosition } from '@polkadot/react-hooks/useElementPosition';

import { WindowSize } from '@polkadot/react-hooks/useWindowSize';

import { HorizontalPosition, VerticalPosition } from './types';

// 0.8rem
const POINTER_OFFSET = 14 * 0.8;
// we don't want our popup window to cover apps menu
const MENU_BAR_HEIGHT = 56;
// adds 1rem margin between browsers window and popup
const FIXED_VERTICAL_OFFSET_MARGIN = 14;

export function getPosition (
  triggerPosition: ElementPosition,
  positionX: HorizontalPosition,
  positionY: VerticalPosition,
  windowPosition?: ElementPosition
): {x: number, y: number} {
  if (!windowPosition) return { x: 0, y: 0 };

  return {
    x: triggerPosition.globalX - getHorizontalOffset(windowPosition.width, positionX),
    y: fitsInView(positionY, triggerPosition, windowPosition.height)
      ? triggerPosition.globalY + getVerticalOffset(triggerPosition.height, positionY, windowPosition.height)
      : getFixedVerticalPosition(triggerPosition.scrollY, positionY, triggerPosition.windowSize, windowPosition.height)
  };
}

function getHorizontalOffset (popupWindowWidth: number, position: HorizontalPosition): number {
  if (position === 'left') {
    return popupWindowWidth - POINTER_OFFSET;
  }

  if (position === 'right') {
    return POINTER_OFFSET;
  }

  return (popupWindowWidth / 2);
}

function fitsInView (positionY: VerticalPosition, trigger: ElementPosition, popupWindowHeight: number): boolean {
  const { height: triggerHeight, scrollY, windowSize, y: triggerY } = trigger;

  if (positionY === 'bottom') {
    return windowSize.height - (triggerHeight / 2) - triggerY - FIXED_VERTICAL_OFFSET_MARGIN > popupWindowHeight;
  }

  return scrollY < MENU_BAR_HEIGHT
    ? triggerY - (MENU_BAR_HEIGHT - scrollY) > popupWindowHeight
    : triggerY > popupWindowHeight;
}

function getVerticalOffset (triggerHeight: number, position: VerticalPosition, windowHeight: number): number {
  if (position === 'bottom') {
    return triggerHeight / 2;
  }

  return (triggerHeight / 2 + windowHeight + POINTER_OFFSET) * -1;
}

function getFixedVerticalPosition (scrollY: number, position: VerticalPosition, windowSize: WindowSize, popupWindowHeight: number): number {
  if (position === 'bottom') {
    return scrollY + windowSize.height - popupWindowHeight - FIXED_VERTICAL_OFFSET_MARGIN;
  }

  return scrollY < MENU_BAR_HEIGHT
    ? MENU_BAR_HEIGHT
    : scrollY;
}
