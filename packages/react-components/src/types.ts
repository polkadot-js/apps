// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { WithTranslation } from 'react-i18next';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { Abi } from '@polkadot/api-contract';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import { TxState } from '@polkadot/react-hooks/types';
import { AccountId, Index } from '@polkadot/types/interfaces';
import { ButtonProps } from './Button/types';
import { InputAddressProps } from './InputAddress/types';
import { TxCallback, TxFailedCallback } from './Status/types';

export type StringOrNull = string | null;

export type VoidFn = () => void;

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

export type ConstructTxFn = () => any[];

export interface TxTriggerProps {
  onOpen: () => void;
}

export type TxTrigger = React.ComponentType<TxTriggerProps>;

export interface TxProps {
  extrinsic?: SubmittableExtrinsic | SubmittableExtrinsic[] | null;
  tx?: string;
  params?: any[] | ConstructTxFn;
}

export interface TxAccountProps {
  className?: string;
  filter?: string[];
  label?: React.ReactNode;
  help?: React.ReactNode;
  onChange: (value: string | null) => void;
}

export interface TxButtonProps extends TxProps {
  accountId?: AccountId | StringOrNull;
  accountNonce?: Index;
  className?: string;
  icon?: IconName;
  isBasic?: boolean;
  isBusy?: boolean;
  isDisabled?: boolean;
  isIcon?: boolean;
  isToplevel?: boolean;
  isUnsigned?: boolean;
  label?: React.ReactNode;
  onClick?: VoidFn;
  onFailed?: TxFailedCallback;
  onSendRef?: React.MutableRefObject<VoidFn | undefined>;
  onStart?: VoidFn;
  onSuccess?: TxCallback;
  onUpdate?: TxCallback;
  tooltip?: string;
  withoutLink?: boolean;
  withSpinner?: boolean;
}

export interface TxModalProps extends I18nProps, TxState {
  accountId?: StringOrNull;
  header?: React.ReactNode;
  isDisabled?: boolean;
  isOpen?: boolean;
  isUnsigned?: boolean;
  children: React.ReactNode;
  preContent?: React.ReactNode;
  trigger?: TxTrigger;
  onSubmit?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
  onSuccess?: () => void;
  onFailed?: () => void;
  modalProps?: {
    [index: string]: any;
  };
  contentClassName?: string;
  inputAddressHelp?: React.ReactNode;
  inputAddressExtra?: React.ReactNode;
  inputAddressLabel?: React.ReactNode;
  inputAddressProps?: Pick<InputAddressProps, never>;
  cancelButtonLabel?: React.ReactNode;
  cancelButtonProps?: Pick<ButtonProps, never>;
  submitButtonIcon?: IconName;
  submitButtonLabel?: React.ReactNode;
  submitButtonProps?: Pick<TxButtonProps, never>;
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
  bgInput: string;
  bgInputError: string;
  bgInverse: string;
  bgMenu: string;
  bgMenuHover: string;
  bgPage: string;
  bgTable: string;
  bgTabs: string;
  bgToggle: string;
  borderTable: string;
  borderTabs: string;
  color: string;
  colorError: string;
  colorLabel: string;
  colorSummary: string;
  theme: 'dark' | 'light';
}

export interface ThemeProps {
  theme: ThemeDef;
}
