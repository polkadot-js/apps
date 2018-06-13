// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '../types';
import type { ApiMethod, ComponentRenderer, DefaultProps, RenderFn, Options } from './types';

import Div from '../Div';
import withApiCall from './apiCall';

export default function withApiDiv<T, Props: BaseProps<T>> (call: ApiMethod, options?: Options<T>): ComponentRenderer<T> {
  return (render: RenderFn, defaultProps?: DefaultProps<T> = {}): React$ComponentType<Props> =>
    withApiCall(call, options)(Div, {
      ...defaultProps,
      render
    });
}
