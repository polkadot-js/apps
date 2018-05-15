// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

export type Route = {
  // flowlint-next-line unclear-type:off
  Component: React$ComponentType<any>,
  i18n: I18Next$Translate$Config,
  // flowlint-next-line unclear-type:off
  icon: React$ComponentType<any> | string,
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
