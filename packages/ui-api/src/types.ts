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
  isApiConnected: boolean,
  isApiReady: boolean,
  apiDefaultTx: SubmittableExtrinsicFunction,
  apiPromise: ApiPromise,
  setApiUrl: (url?: string) => void
};

export type OnChangeCb$Obs<T> = { next: (value?: T) => any };
export type OnChangeCb$Fn<T> = (value?: T) => void;

export type OnChangeCb<T> = OnChangeCb$Obs<T> | OnChangeCb$Fn<T> | undefined;

export type ChangeProps<T> = {
  rxChange?: OnChangeCb<T>
};

export type ParamProps = {
  params?: Array<any>
};

export type RxProps<T> = {
  rxUpdated?: boolean;
  rxUpdatedAt?: number;
  value?: T;
};

export type BaseProps<T> = BareProps & ApiProps & ChangeProps<T> & ParamProps & RxProps<T> & {
  children?: React.ReactNode,
  label?: string,
  render?: (value?: T) => React.ReactNode
};

export type Formatter = (value?: any) => string;
