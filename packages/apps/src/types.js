// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '@polkadot/ui-app/types';

export type Route = {
  Component: React$ComponentType<BareProps>,
  i18n: I18Next$Translate$Config,
  icon: string,
  isExact: boolean,
  isHidden: boolean,
  name: string,
  path?: string
};

export type Routes = Array<Route | null>;

export type Routing = {
  default: string,
  routes: Routes,
  unknown: Route
}
