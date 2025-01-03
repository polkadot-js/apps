// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { WindowSize } from '@polkadot/react-hooks/ctx/types';
import type { ElementPosition, HorizontalPosition, VerticalPosition } from './types.js';

interface Coords {
  x: number;
  y: number;
}

// 0.8rem
const POINTER_OFFSET = 14 * 0.8;
// we don't want our popup window to cover apps menu
const MENU_BAR_HEIGHT = 56;
// adds 1rem margin between browsers window and popup
const FIXED_VERTICAL_OFFSET_MARGIN = 14;

export function getPosition (triggerPosition: ElementPosition, positionX: HorizontalPosition, positionY: VerticalPosition, windowPosition: ElementPosition, scrollY: number, windowSize: WindowSize): Coords {
  const globalX = triggerPosition.x + (triggerPosition.width / 2);
  const globalY = triggerPosition.y + scrollY + (triggerPosition.height / 2);

  return {
    x: globalX - getHorizontalOffset(windowPosition.width, positionX),
    y: fitsInView(positionY, triggerPosition, windowPosition.height, windowSize, scrollY)
      ? globalY + getVerticalOffset(triggerPosition.height, positionY, windowPosition.height)
      : getFixedVerticalPosition(scrollY, positionY, windowSize, windowPosition.height)
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

function fitsInView (positionY: VerticalPosition, trigger: ElementPosition, popupWindowHeight: number, windowSize: WindowSize, scrollY: number): boolean {
  const { height: triggerHeight, y: triggerY } = trigger;

  if (positionY === 'bottom') {
    return windowSize.height - triggerHeight - triggerY - FIXED_VERTICAL_OFFSET_MARGIN > popupWindowHeight;
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
