// Copyright 2017-2020 @canvas-ui/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
