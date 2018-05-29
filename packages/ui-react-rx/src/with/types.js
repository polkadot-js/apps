// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Interface$Method } from '@polkadot/jsonrpc/types';
import type { Param$Values } from '@polkadot/params/types';
import type { Storage$Key$Values } from '@polkadot/storage/types';
import type { OnChangeCb } from '../types';

import React from 'react';

// flowlint-next-line unclear-type:off
export type Transform = (value: any, index: number) => any;

export type DefaultProps<T> = {
  onChange?: OnChangeCb<T>,
  [string]: mixed
};

export type Options<T> = {
  onChange?: OnChangeCb<T>,
  propName?: string,
  transform?: Transform
};

export type StorageTransform = (value?: Uint8Array, index: number) => Param$Values | null;

export type StorageOptions<T> = Options<T> & {
  params?: Storage$Key$Values;
};

// flowlint-next-line unclear-type:off
export type HOC<T> = (Component: React$ComponentType<any>, defaultProps?: DefaultProps<T>) => Class<React.Component<any, any>>;

export type ApiMethod = $Shape<Interface$Method>;

// flowlint-next-line unclear-type:off
export type RenderFn = (value?: any) => any;

// flowlint-next-line unclear-type:off
export type ComponentRenderer<T> = (render: RenderFn, defaultProps?: DefaultProps<T>) => React$ComponentType<any>;
