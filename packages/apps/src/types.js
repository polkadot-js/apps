// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

export type Route = {
  component: React$ComponentType<*>,
  i18n: I18Next$Translate$Config,
  icon: React$ComponentType<*> | string,
  isExact: boolean,
  isHidden: boolean,
  name: string,
  path?: string
};

export type Routes = Array<Route>;

export type Routing = {
  default: string,
  routes: Routes
}
