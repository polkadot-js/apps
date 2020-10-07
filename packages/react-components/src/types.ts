// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { WithTranslation } from 'react-i18next';
import { ButtonProps as SUIButtonProps } from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import { StringOrNull, VoidFn } from '@canvas-ui/react-util/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { InkAbi } from '@polkadot/api-contract';
import { TxState } from '@canvas-ui/react-hooks/types';
import { AccountId, Index } from '@polkadot/types/interfaces';
import { ButtonProps } from './Button/types';
import { InputAddressProps } from './InputAddress/types';
import { TxCallback, TxFailedCallback } from './Status/types';

export interface BareProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
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
  icon?: string;
  iconSize?: SUIButtonProps['size'];
  isBasic?: boolean;
  isDisabled?: boolean;
  isIcon?: boolean;
  isNegative?: boolean;
  isPrimary?: boolean;
  isUnsigned?: boolean;
  label?: React.ReactNode;
  onClick?: VoidFn;
  onFailed?: TxFailedCallback;
  onSendRef?: React.MutableRefObject<VoidFn | undefined>;
  onStart?: VoidFn;
  onSuccess?: TxCallback;
  onUpdate?: TxCallback;
  size?: SUIButtonProps['size'];
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
  submitButtonIcon?: string;
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
