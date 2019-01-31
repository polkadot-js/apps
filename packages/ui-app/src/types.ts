// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WithNamespaces } from 'react-i18next';
import { RpcRxInterface } from '@polkadot/rpc-rx/types';
import { ActionStatus } from '@polkadot/ui-app/Status/types';

export type BareProps = {
  className?: string,
  style?: {
    [index: string]: any
  }
};

export type AppProps = {
  basePath: string,
  location: Location,
  onStatusChange: (status: ActionStatus) => void
};

export type I18nProps = BareProps & WithNamespaces;

export type BaseContext = {
  api: RpcRxInterface,
  // TODO: Set the correct type
  router: {
    route: {
      location: Location
    }
  }
};

export type BitLength = 8 | 16 | 32 | 64 | 128 | 256;
