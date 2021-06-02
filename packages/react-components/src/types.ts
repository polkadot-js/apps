// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';
import type { WithTranslation } from 'react-i18next';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { Abi } from '@polkadot/api-contract';
import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { AccountId, Index } from '@polkadot/types/interfaces';
import type { TxCallback, TxFailedCallback } from './Status/types';

export interface BareProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface AppProps {
  basePath: string;
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
}

export type I18nProps = BareProps & WithTranslation;

export interface TxButtonProps {
  accountId?: AccountId | string | null;
  accountNonce?: Index;
  className?: string;
  extrinsic?: SubmittableExtrinsic<'promise'> | SubmittableExtrinsic<'promise'>[] | null;
  icon?: IconName;
  isBasic?: boolean;
  isBusy?: boolean;
  isDisabled?: boolean;
  isIcon?: boolean;
  isToplevel?: boolean;
  isUnsigned?: boolean;
  label?: React.ReactNode;
  onClick?: () => void;
  onFailed?: TxFailedCallback;
  onSendRef?: React.MutableRefObject<(() => void) | undefined>;
  onStart?: () => void;
  onSuccess?: TxCallback;
  onUpdate?: TxCallback;
  params?: any[] | (() => any[]) | null;
  tooltip?: string;
  tx?: ((...args: any[]) => SubmittableExtrinsic<'promise'>) | null;
  withoutLink?: boolean;
  withSpinner?: boolean;
}

export type BitLength = 8 | 16 | 32 | 64 | 128 | 256;

interface ContractBase {
  abi: Abi;
}

export interface Contract extends ContractBase {
  address: null;
}

export interface ContractDeployed extends ContractBase {
  address: string;
}

export type CallContract = ContractDeployed;

export interface NullContract {
  abi: null;
  address: null;
}

export interface ThemeDef {
  theme: 'dark' | 'light';
}

export interface ThemeProps {
  theme: ThemeDef;
}
