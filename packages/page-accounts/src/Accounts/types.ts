// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { WithTranslation } from 'react-i18next';
import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { KeyringAddress } from '@polkadot/ui-keyring/types';

export type { AppProps as ComponentProps } from '@polkadot/react-components/types';

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
