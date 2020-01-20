// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps } from '@polkadot/react-components/types';
import { ActionStatus } from '@polkadot/react-components/Status/types';

import { WithTranslation } from 'react-i18next';

export interface BareProps {
  className?: string;
  style?: Record<string, any>;
}

export type I18nProps = BareProps & WithTranslation;

export type ComponentProps = AppProps;

export interface ModalProps {
  onClose: () => void;
  onStatusChange: (status: ActionStatus) => void;
}
