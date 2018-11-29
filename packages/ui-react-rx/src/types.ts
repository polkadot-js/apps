// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { RpcRxInterface } from '@polkadot/rpc-rx/types';

import ApiObservable from '@polkadot/api-observable';

export type BareProps = {
  className?: string,
  style?: { [index: string]: any }
};

export type ApiProps = {
  isApiConnected: boolean,
  isApiReady: boolean,
  api: RpcRxInterface,
  apiMethods: {
    [index: string]: boolean
  },
  apiObservable: ApiObservable,
  apiSupport: 'latest',
  setApi: (api: RpcRxInterface) => void,
  setApiProvider: (provider?: ProviderInterface) => void,
  setApiWsUrl: (url?: string) => void
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
  render?: (value?: T) => any // node?
};

export type Formatter = (value?: any) => string;
