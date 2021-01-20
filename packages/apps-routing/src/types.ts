// Copyright 2017-2021 @canvas-ui/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AppProps } from '@canvas-ui/apps/types';
import { BareProps } from '@canvas-ui/react-components/types';

export interface RouteProps extends AppProps, BareProps {
  location: any;
}

export interface Route {
  Component: React.ComponentType<RouteProps>;
  Modal?: React.ComponentType<any>;
  display: {
    isHidden?: boolean;
    needsAccounts?: boolean;
    needsCodes?: boolean;
    needsApi?: (string | string[])[];
    needsSudo?: boolean;
  };
  isIgnored?: boolean;
  name: string;
  text: string;
  useCounter?: () => number | string | null;
}

export type Routes = (Route | null)[];
