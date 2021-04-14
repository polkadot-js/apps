// Copyright 2017-2021 @polkadot/apps authors & contributors
// and @canvas-ui/app authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ScreenSizes } from '@canvas-ui/react-components/constants';

export enum SideBarTransition {
  COLLAPSED = 'COLLAPSED',
  EXPANDED = 'EXPANDED',
  EXPANDED_AND_MAXIMISED = 'EXPANDED_AND_MAXIMISED',
  MINIMISED_AND_EXPANDED = 'MINIMISED_AND_EXPANDED'
}

export const SIDEBAR_MENU_THRESHOLD = ScreenSizes.DESKTOP;
