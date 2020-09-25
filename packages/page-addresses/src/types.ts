// Copyright 2017-2020 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ActionStatus } from '@polkadot/react-components/Status/types';
import { Balance, Conviction } from '@polkadot/types/interfaces';
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
