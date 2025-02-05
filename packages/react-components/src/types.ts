// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@polkadot/api-augment';

import type { IconName } from '@fortawesome/fontawesome-svg-core';
import type React from 'react';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { Abi } from '@polkadot/api-contract';
import type { Registrar } from '@polkadot/react-hooks/types';
import type { AccountId, AccountIndex, Address, Index } from '@polkadot/types/interfaces';
import type { ActionStatus, TxCallback, TxFailedCallback } from './Status/types.js';

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

export interface ThemeDef {
  theme: 'dark' | 'light';
}

export interface I18nProps extends BareProps {
  t: (key: string, options?: { replace: Record<string, unknown> }) => string;
}

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
  params?: unknown[] | (() => unknown[]) | null;
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

export interface ThemeProps {
  theme: ThemeDef;
}

export type FlagColor = 'blue' | 'black' | 'green' | 'grey' | 'lightgrey' | 'orange' | 'pink' | 'purple' | 'red' | 'yellow' | 'theme';

export type AccountIdIsh = AccountId | AccountIndex | Address | string | Uint8Array | null;

export type DisplayedJudgement = 'Erroneous' | 'Low quality' | 'Known good' | 'Reasonable';

export interface Judgement {
  judgementName: DisplayedJudgement;
  registrars: (Registrar | undefined)[];
}

export type UseJudgements = Judgement[]

export interface TabItem {
  alias?: string;
  count?: number;
  hasParams?: boolean;
  isExact?: boolean;
  isHidden?: boolean;
  isRoot?: boolean;
  name: string;
  text: React.ReactNode;
}

export interface ProgressBarSection {
  value: number;
  total: number;
  label: string;
}
