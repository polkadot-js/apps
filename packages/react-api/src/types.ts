// Copyright 2017-2020 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { InjectedExtension } from '@polkadot/extension-inject/types';
import { SubmittableExtrinsicFunction } from '@polkadot/api/promise/types';

import ApiPromise from '@polkadot/api/promise';

// helpers for HOC props
export type OmitProps<T, K> = Pick<T, Exclude<keyof T, K>>;
export type SubtractProps<T, K> = OmitProps<T, keyof K>;

export interface BareProps {
  className?: string;
}

export interface ApiState {
  apiDefaultTx: SubmittableExtrinsicFunction;
  apiDefaultTxSudo: SubmittableExtrinsicFunction;
  hasInjectedAccounts: boolean;
  isApiReady: boolean;
  isDevelopment: boolean;
  isSubstrateV2: boolean;
  systemChain: string;
  systemName: string;
  systemVersion: string;
}

export interface ApiProps extends ApiState {
  api: ApiPromise;
  extensions?: InjectedExtension[];
  isApiConnected: boolean;
  isApiInitialized: boolean;
  isWaitingInjected: boolean;
}

export interface OnChangeCbObs {
  next: (value?: any) => any;
}

export type OnChangeCbFn = (value?: any) => any;
export type OnChangeCb = OnChangeCbObs | OnChangeCbFn;

export interface ChangeProps {
  callOnResult?: OnChangeCb;
}

export interface CallState {
  callResult?: unknown;
  callUpdated?: boolean;
  callUpdatedAt?: number;
}

export type CallProps = ApiProps & CallState;

export type BaseProps<T> = BareProps & CallProps & ChangeProps & {
  children?: React.ReactNode;
  label?: string;
  render?: (value?: T) => React.ReactNode;
};

export type Formatter = (value?: any) => string;

export type Environment = 'web' | 'app';
