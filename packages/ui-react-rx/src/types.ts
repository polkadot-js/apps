// Copyright 2017-2019 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiPromise from '@polkadot/api/promise';

export type BareProps = {
  className?: string,
  style?: { [index: string]: any }
};

export type ApiProps = {
  isApiConnected: boolean,
  isApiReady: boolean,
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
