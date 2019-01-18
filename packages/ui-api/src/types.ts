// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsicFunction } from '@polkadot/api/promise/types';
import ApiPromise from '@polkadot/api/promise';

// helpers for HOC props
export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export type Subtract<T, K> = Omit<T, keyof K>;

export type BareProps = {
  className?: string,
  style?: { [index: string]: any }
};

export type ApiProps = {
  api: ApiPromise,
  apiDefaultTx: SubmittableExtrinsicFunction,
  isApiConnected: boolean,
  isApiReady: boolean,
  setApiUrl: (url?: string) => void
};

export type OnChangeCb$Obs = { next: (value?: any) => any };
export type OnChangeCb$Fn = (value?: any) => any;

export type OnChangeCb = OnChangeCb$Obs | OnChangeCb$Fn;

export type ChangeProps = {
  callOnResult?: OnChangeCb
};

export type ParamProps = {
  params?: any
};

export type CallState = {
  callResult?: any;
  callUpdated?: boolean;
  callUpdatedAt?: number;
};

export type CallProps = ApiProps & CallState;

export type BaseProps<T> = BareProps & CallProps & ChangeProps & ParamProps & {
  children?: React.ReactNode,
  label?: string,
  render?: (value?: T) => React.ReactNode
};

export type Formatter = (value?: any) => string;
