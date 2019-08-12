// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ScreenSizes } from '@polkadot/react-components/constants';

export enum SideBarTransition {
  COLLAPSED = 'COLLAPSED',
  EXPANDED = 'EXPANDED',
  EXPANDED_AND_MAXIMISED = 'EXPANDED_AND_MAXIMISED',
  MINIMISED_AND_EXPANDED = 'MINIMISED_AND_EXPANDED'
}

export const SIDEBAR_MENU_THRESHOLD = ScreenSizes.DESKTOP;
export const SIDEBAR_TRANSITION_DURATION = 300;
