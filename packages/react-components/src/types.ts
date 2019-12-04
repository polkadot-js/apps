// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WithTranslation } from 'react-i18next';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { Abi } from '@polkadot/api-contract';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import { InputAddressProps } from '@polkadot/react-components/InputAddress/types';
import { IExtrinsic } from '@polkadot/types/types';
import { ApiProps } from '@polkadot/react-api/types';
import { TxState } from '@polkadot/react-hooks/types';
import { Index } from '@polkadot/types/interfaces';
import { ButtonProps, Button$OnClick, Button$Sizes } from './Button/types';
import { TxCallback, TxFailedCallback } from './Status/types';

export interface BareProps {
  className?: string;
  style?: Record<string, string | number>;
}

export interface AppProps {
  basePath: string;
  onStatusChange: (status: ActionStatus) => void;
}

export type I18nProps = BareProps & WithTranslation;

export type ButtonRef = React.RefObject<React.Component<ButtonProps>>;

// export type FormProps$Ref = React.MutableRefObject<Button$OnClick>;

export interface FormProps {
  onCancel: Button$OnClick;
  onSubmit: Button$OnClick;
}

// export interface FormProps$Hooks {
//   onInputEnterKey: () => void;
//   onInputEscapeKey: () => void;
// }

// export interface FormProps extends FormProps$Refs, FormProps$Hooks {}

export type ConstructTxFn = () => any[];

export type TxTrigger = React.ComponentType<TxTriggerProps>;

export interface TxTriggerProps {
  onOpen: () => void;
}

export interface TxButtonInterface {
  component?: {
    current?: {
      send: () => void;
    };
  };
}

export interface TxProps {
  extrinsic?: IExtrinsic | SubmittableExtrinsic | null;
  tx?: string;
  params?: any[] | ConstructTxFn;
}

export interface TxButtonProps extends TxProps, ApiProps {
  accountId?: string;
  accountNonce?: Index;
  className?: string;
  icon: string;
  iconSize?: Button$Sizes;
  innerRef: ButtonRef;
  isBasic?: boolean;
  isDisabled?: boolean;
  isNegative?: boolean;
  isPrimary?: boolean;
  isUnsigned?: boolean;
  label: React.ReactNode;
  onClick?: () => any;
  onFailed?: TxFailedCallback;
  onStart?: () => void;
  onSuccess?: TxCallback;
  onUpdate?: TxCallback;
  tooltip?: string;
  withSpinner?: boolean;
}

export interface TxButtonNewProps extends TxProps {
  accountId?: StringOrNull;
  accountNonce?: Index;
  className?: string;
  icon: string;
  iconSize?: Button$Sizes;
  isBasic?: boolean;
  isDisabled?: boolean;
  isNegative?: boolean;
  isPrimary?: boolean;
  isUnsigned?: boolean;
  label: React.ReactNode;
  onClick?: () => any;
  onFailed?: TxFailedCallback;
  onStart?: () => void;
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
  submitButtonIcon?: string;
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
