// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BaseProps, ObservableApiNames } from '../types';
import { ComponentRenderer, DefaultProps, RenderFn, Options } from './types';

import Div from '../Div';
import withApiObservable from './apiObservable';

export default function withApiObservableDiv<T, Props extends BaseProps<T>> (call: ObservableApiNames, options: Options<T> = {}): ComponentRenderer<T> {
  return (render: RenderFn, defaultProps: DefaultProps<T> = {}): React.ComponentType<Props> =>
    withApiObservable(call, { ...options, propName: 'value' })(Div, {
      ...defaultProps,
      render
    });
}
