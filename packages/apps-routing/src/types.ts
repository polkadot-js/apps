// Copyright 2017-2019 @polkadot/apps-routing authors & contributors
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
  i18n: {
    defaultValue: string;
  };
  icon: SemanticICONS;
  name: string;
}

export type Routes = (Route | null)[];

export interface Routing {
  default: string;
  routes: Routes;
}
