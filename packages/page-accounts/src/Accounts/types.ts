// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ActionStatus } from '@polkadot/react-components/Status/types';
import { KeyringAddress } from '@polkadot/ui-keyring/types';

import { WithTranslation } from 'react-i18next';

export { AppProps as ComponentProps } from '@polkadot/react-components/types';

export interface BareProps {
  className?: string;
}

export interface I18nProps extends BareProps, WithTranslation {}

export interface ModalProps {
  onClose: () => void;
  onStatusChange: (status: ActionStatus) => void;
}

export interface SortedAccount {
  account: KeyringAddress;
  children: SortedAccount[];
  isFavorite: boolean;
}

export interface AmountValidateState {
  error: string | null;
  warning: string | null;
}
