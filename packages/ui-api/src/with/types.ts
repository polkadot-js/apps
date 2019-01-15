// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { OnChangeCb } from '../types';

import React from 'react';

export type Transform = (value: any, index: number) => any;

export type DefaultProps = {
  callOnChange?: OnChangeCb,
  [index: string]: any
};

export type Options = {
  at?: Uint8Array | string,
  atProp?: string,
  callOnChange?: OnChangeCb,
  params?: Array<any>,
  paramProp?: string,
  propName?: string,
  transform?: Transform
};

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export type Subtract<T, K> = Omit<T, keyof K>;

export type RenderFn = (value?: any) => React.ReactNode;

export type StorageTransform = (input: any, index: number) => any | null;

export type ApiMethod = {
  name: string,
  section?: string
};

export type ComponentRenderer<T> = (render: RenderFn, defaultProps?: DefaultProps) => React.ComponentType<any>;
