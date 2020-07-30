// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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

export type TxTrigger = React.ComponentType<TxTriggerProps>;

export interface TxTriggerProps {
  onOpen: () => void;
}

export interface TxProps {
  extrinsic?: SubmittableExtrinsic | null;
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
  isUnsigned?: boolean;
  label?: React.ReactNode;
  onClick?: VoidFn;
  onFailed?: TxFailedCallback;
  onSendRef?: React.MutableRefObject<VoidFn | undefined>;
  onStart?: VoidFn;
  onSuccess?: TxCallback;
  onUpdate?: TxCallback;
  tooltip?: string;
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

export type StringOrNull = string | null;

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
