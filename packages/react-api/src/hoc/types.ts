// Copyright 2017-2025 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';
import type { OnChangeCb } from '../types.js';

export type Transform = (value: any, index: number) => any;

export interface DefaultProps {
  callOnResult?: OnChangeCb;
  [index: string]: any;
}

export interface Options {
  at?: Uint8Array | string;
  atProp?: string;
  callOnResult?: OnChangeCb;
  fallbacks?: string[];
  isMulti?: boolean;
  params?: unknown[];
  paramName?: string;
  paramPick?: (props: any) => unknown;
  paramValid?: boolean;
  propName?: string;
  skipIf?: (props: any) => boolean;
  transform?: Transform;
  withIndicator?: boolean;
}

export type RenderFn = (value?: any) => any;

export type StorageTransform = (input: any, index: number) => unknown;

export type HOC = (Component: React.ComponentType<unknown>, defaultProps?: DefaultProps, render?: RenderFn) => React.ComponentType<unknown>;

export interface ApiMethod {
  name: string;
  section?: string;
}

export type ComponentRenderer = (render: RenderFn, defaultProps?: DefaultProps) => React.ComponentType<any>;

export type OmitProps<T, K> = Pick<T, Exclude<keyof T, K>>;
export type SubtractProps<T, K> = OmitProps<T, keyof K>;
