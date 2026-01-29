// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';
import type React from 'react';
import type { ApiPromise } from '@polkadot/api';
import type { AppProps, BareProps } from '@polkadot/react-components/types';

export type RouteGroup = 'accounts' | 'developer' | 'governance' | 'network' | 'files' | 'settings';

export interface RouteProps extends AppProps, BareProps {
  location: any;
}

export interface Route {
  Component: React.ComponentType<any>;
  Modal?: React.ComponentType<any>;
  display: {
    isDevelopment?: boolean;
    isHidden?: boolean;
    isModal?: boolean;
    needsAccounts?: boolean;
    needsApi?: (string | string[])[];
    needsApiCheck?: (api: ApiPromise) => boolean;
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

export type TFunction = (key: string, textOrOptions?: string | { replace: Record<string, unknown> }, options?: { ns: string }) => string;
