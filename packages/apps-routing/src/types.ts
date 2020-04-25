// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic';
import { AppProps, BareProps } from '@polkadot/react-components/types';

export interface RouteProps extends AppProps, BareProps {
  location: any;
}

export interface Route {
  Component: React.ComponentType<RouteProps>;
  Modal?: React.ComponentType<any>;
  display: {
    isHidden?: boolean;
    isModal?: boolean;
    needsAccounts?: boolean;
    needsApi?: (string | string[])[];
    needsSudo?: boolean;
  };
  icon: SemanticICONS;
  isIgnored?: boolean;
  name: string;
  text: string;
  useCheck?: () => boolean;
  useCounter?: () => number;
}

export type Routes = (Route | null)[];
