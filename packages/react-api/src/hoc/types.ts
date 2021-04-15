// Copyright 2017-2021 @polkadot/react-api authors & contributors
// and @canvas-ui/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { OnChangeCb } from '../types';

type Transform = (value: any, index: number) => any;

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
  params?: any[];
  paramName?: string;
  paramPick?: (props: any) => any;
  paramValid?: boolean;
  propName?: string;
  skipIf?: (props: any) => boolean;
  transform?: Transform;
  withIndicator?: boolean;
}

export type RenderFn = (value?: any) => React.ReactNode;

export type HOC = (Component: React.ComponentType<any>, defaultProps?: DefaultProps, render?: RenderFn) => React.ComponentType<any>;
