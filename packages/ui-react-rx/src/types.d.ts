// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ProviderInterface } from '@polkadot/api-provider/types';
import { RxApiInterface } from '@polkadot/api-rx/types';
import { EncodingVersions } from '@polkadot/params/types';
import { Storage$Key$Value } from '@polkadot/storage/types';

export type BareProps = {
  className?: string,
  style?: { [index: string]: any }
};

export type ApiProps = {
  api: RxApiInterface,
  apiConnected: boolean,
  apiSupport: EncodingVersions,
  setApi: (api: RxApiInterface) => void,
  setApiProvider: (provider?: ProviderInterface) => void,
  setApiWsUrl: (url?: string) => void
};

type OnChangeCb$Obs<T> = { next: (value?: T) => any };
type OnChangeCb$Fn<T> = (value?: T) => void;

export type OnChangeCb<T> = OnChangeCb$Obs<T> | OnChangeCb$Fn<T> | undefined;

export type ChangeProps<T> = {
  onChange?: OnChangeCb<T>
};

export type ParamProps = {
  params?: Array<Storage$Key$Value>
};

export type RxProps<T> = {
  rxUpdated?: boolean;
  rxUpdatedAt?: number;
  value?: T;
}

export type BaseProps<T> = BareProps & ApiProps & ChangeProps<T> & ParamProps & RxProps<T> & {
  children?: any, // node?
  label?: string,
  render?: (value?: T) => any // node?
};

export type Formatter = (value?: any) => string;
