// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ProviderInterface } from '@polkadot/api-provider/types';
import type { RxApiInterface } from '@polkadot/api-rx/types';
import type { EncodingVersions } from '@polkadot/params/types';
import type { Storage$Key$Values } from '@polkadot/storage/types';

export type BareProps = {
  className?: string,
  style?: { [string]: mixed }
};

export type ApiProps = {
  api: RxApiInterface,
  apiConnected: boolean,
  apiSupport: EncodingVersions,
  setApi: (api: RxApiInterface) => void,
  setApiProvider: (provider?: ProviderInterface) => void,
  setApiWsUrl: (url?: string) => void
};

export type OnChangeCb<T> = rxjs$Subject<T> | (value: T) => void;

export type ChangeProps<T> = {
  onChange?: OnChangeCb<T>
};

export type ParamProps = {
  params?: Storage$Key$Values
};

export type RxProps<T> = {
  rxUpdated?: boolean;
  rxUpdatedAt?: number;
  value?: T;
}

export type BaseProps<T> = BareProps & ApiProps & ChangeProps<T> & ParamProps & RxProps<T> & {
  children?: React$Node,
  label?: string,
  render?: (value?: T) => React$Node
};

// flowlint-next-line unclear-type:off
export type Formatter = (value?: any) => string;
