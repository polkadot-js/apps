// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BaseProps } from '../types';
import { ApiMethod, ComponentRenderer, DefaultProps, RenderFn, Options } from './types';

import withObservableDiv from './observableDiv';

export default function withApiDiv<T, Props extends BaseProps<T>> (call: ApiMethod, options?: Options<T>): ComponentRenderer<T> {
  return (render: RenderFn, defaultProps: DefaultProps<T> = {}): React.ComponentType<Props> =>
    withObservableDiv('rawCall', { ...options, params: [call] })(render, defaultProps);
}
