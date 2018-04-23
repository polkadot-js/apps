// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Location } from 'react-router-dom';
import type { RxApiInterface } from '@polkadot/rx-api/types';

export type BaseProps = {
  className?: string,
  style?: {
    [string]: string
  },
  t: I18Next$Translate
};

export type BaseContext = {
  api: RxApiInterface,
  // TODO: Set the correct/full type
  router: {
    route: {
      location: Location
    }
  }
};

export type Route = {
  component: React$StatelessFunctionalComponent<*>,
  i18n: I18Next$Translate$Config,
  icon: React$StatelessFunctionalComponent<*> | string,
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
