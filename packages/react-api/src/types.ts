// Copyright 2017-2022 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsicFunction } from '@polkadot/api/promise/types';
import type { LinkOption } from '@polkadot/apps-config/settings/types';
import type { InjectedExtension } from '@polkadot/extension-inject/types';
import type { ProviderStats } from '@polkadot/rpc-provider/types';

// helpers for HOC props
export type OmitProps<T, K> = Pick<T, Exclude<keyof T, K>>;
export type SubtractProps<T, K> = OmitProps<T, keyof K>;

export interface BareProps {
  className?: string;
}

export interface ApiState {
  apiDefaultTx: SubmittableExtrinsicFunction;
  apiDefaultTxSudo: SubmittableExtrinsicFunction;
  chainSS58: number;
  hasInjectedAccounts: boolean;
  isApiReady: boolean;
  isDevelopment: boolean;
  isEthereum: boolean;
  specName: string;
  specVersion: string;
  systemChain: string;
  systemName: string;
  systemVersion: string;
}

export interface ApiProps extends ApiState {
  api: ApiPromise;
  apiEndpoint: LinkOption | null;
  apiError: string | null;
  apiRelay: ApiPromise | null;
  apiUrl?: string;
  createLink: (path: string, apiUrl?: string) => string;
  extensions?: InjectedExtension[];
  getStats: (...apis: ApiPromise[]) => [ProviderStats, number];
  isApiConnected: boolean;
  isApiInitialized: boolean;
  isElectron: boolean;
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

export interface BaseProps<T> extends BareProps, CallProps, ChangeProps {
  children?: React.ReactNode;
  label?: string;
  render?: (value?: T) => React.ReactNode;
}

export type Formatter = (value?: any) => string;

export type Environment = 'web' | 'app';
