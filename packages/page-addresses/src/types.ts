// Copyright 2017-2025 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { WithTranslation } from 'react-i18next';
import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { Balance, Conviction } from '@polkadot/types/interfaces';
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

export interface Delegation {
  accountDelegated: string
  amount: Balance
  conviction: Conviction
}

export interface SortedAccount {
  account: KeyringAddress;
  children: SortedAccount[];
  delegation?: Delegation;
  isFavorite: boolean;
}
