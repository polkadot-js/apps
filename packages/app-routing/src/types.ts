// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// and @canvas-ui/app-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

<<<<<<< HEAD:packages/apps-routing/src/types.ts
import { AppProps, BareProps } from '@canvas-ui/react-components/types';
=======
import { AppProps } from '@canvas-ui/app/types';
import { BareProps } from '@canvas-ui/react-components/types';
>>>>>>> parity/master:packages/app-routing/src/types.ts

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
