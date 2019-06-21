// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// location props passed by react-router from a link can contain a "state" object
// this is used for Account creation link to popup the account creation modal
import { LocationDescriptorObject } from 'history';
import { WithTranslation } from 'react-i18next';
import { ActionStatus } from '@polkadot/ui-app/Status/types';

export type BareProps = {
  className?: string,
  style?: {
    [index: string]: any
  }
};

export type AppProps = {
  basePath: string,
  location: LocationDescriptorObject,
  onStatusChange: (status: ActionStatus) => void
};

export type I18nProps = BareProps & WithTranslation;

export type BitLength = 8 | 16 | 32 | 64 | 128 | 256;
