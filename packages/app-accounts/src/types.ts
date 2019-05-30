// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps } from '@polkadot/ui-app/types';
import { ActionStatus } from '@polkadot/ui-app/Status/types';

import { WithTranslation } from 'react-i18next';

export type LocationProps = {
  match: {
    params: { [index: string]: any }
  }
};

export type BareProps = {
  className?: string,
  style?: {
    [index: string]: any
  }
};

export type I18nProps = BareProps & WithTranslation;

export type ComponentProps = AppProps & LocationProps;

export type ModalProps = {
  onClose: () => void,
  onStatusChange: (status: ActionStatus) => void
};
