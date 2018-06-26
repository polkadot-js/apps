// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Param$Values } from '@polkadot/params/types';
import { Storage$Key$Value } from '@polkadot/storage/types';
import { OnChangeCb } from '../types';

import React from 'react';

export type Transform = (value: any, index: number) => any;

export type DefaultProps<T> = {
  onChange?: OnChangeCb<T>,
  [index: string]: any
};

export type Options<T> = {
  onChange?: OnChangeCb<T>,
  propName?: string,
  transform?: Transform
};

export type StorageTransform = (input: any, index: number) => Param$Values | null;

export type StorageOptions<T> = Options<T> & {
  params?: Array<Storage$Key$Value | undefined>;
};

export type HOC<T> = (Component: React.ComponentType<any>, defaultProps?: DefaultProps<T>) => React.ComponentType<any>;

export type ApiMethod = {
  name: string,
  section?: string
};

export type RenderFn = (value?: any) => any;

export type ComponentRenderer<T> = (render: RenderFn, defaultProps?: DefaultProps<T>) => React.ComponentType<any>;
