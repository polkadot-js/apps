// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { OnChangeCb } from '../types';

import React from 'react';

export type Transform = (value: any, index: number) => any;

export type DefaultProps = {
  callOnResult?: OnChangeCb,
  [index: string]: any
};

export type Options = {
  at?: Uint8Array | string,
  atProp?: string,
  callOnResult?: OnChangeCb,
  isMulti?: boolean,
  params?: Array<any>,
  paramName?: string,
  paramPick?: (props: any) => any,
  paramValid?: boolean,
  propName?: string,
  transform?: Transform
};

export type RenderFn = (value?: any) => React.ReactNode;

export type StorageTransform = (input: any, index: number) => any | null;

export type HOC = (Component: React.ComponentType<any>, defaultProps?: DefaultProps, render?: RenderFn) => React.ComponentType<any>;

export type ApiMethod = {
  name: string,
  section?: string
};

export type ComponentRenderer = (render: RenderFn, defaultProps?: DefaultProps) => React.ComponentType<any>;

export type OmitProps<T, K> = Pick<T, Exclude<keyof T, K>>;
export type SubtractProps<T, K> = OmitProps<T, keyof K>;
