// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconName } from '@fortawesome/fontawesome-svg-core';
import { AppProps, BareProps } from '@polkadot/react-components/types';

export type RouteGroup = 'accounts' | 'developer' | 'governance' | 'network' | 'settings';

export interface RouteProps extends AppProps, BareProps {
  location: any;
}

export interface Route {
  TabsComponent?: React.ComponentType<RouteProps>;
  Component: React.ComponentType<RouteProps>;
  Modal?: React.ComponentType<any>;
  helpText?: string;
  display: {
    isHidden?: boolean;
    isModal?: boolean;
    needsAccounts?: boolean;
    needsApi?: (string | string[])[];
    needsSudo?: boolean;
  };
  group: RouteGroup;
  icon: IconName;
  isIgnored?: boolean;
  name: string;
  text: string;
  useCounter?: () => number | string | null;
}

export type Routes = Route[];
