// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';
import type { AppProps, BareProps } from '@polkadot/react-components/types';

export type RouteGroup = 'accounts' | 'developer' | 'governance' | 'network' | 'settings';

export interface RouteProps extends AppProps, BareProps {
  location: any;
}

export interface Route {
  // FIXME This is weird, we really expect the memo to be there...
  Component: React.ComponentType<RouteProps> | React.MemoExoticComponent<any>;
  Modal?: React.ComponentType<any> | React.MemoExoticComponent<any>;
  display: {
    isHidden?: boolean;
    isModal?: boolean;
    needsAccounts?: boolean;
    needsApi?: (string | string[])[];
    needsApiInstances?: boolean;
    needsSudo?: boolean;
    needsTeleport?: boolean;
  };
  group: RouteGroup;
  icon: IconName;
  isIgnored?: boolean;
  name: string;
  text: string;
  useCounter?: () => number | string | null;
}

export type Routes = Route[];
