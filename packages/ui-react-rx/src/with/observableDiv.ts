// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiFunctions } from '@polkadot/api-observable/types';
import { BaseProps } from '../types';
import { ComponentRenderer, DefaultProps, RenderFn, Options } from './types';

import Div from '../Div';
import withObservable from './observable';

export default function withObservableDiv<T, Props extends BaseProps<T>> (call: ApiFunctions, options?: Options<T>): ComponentRenderer<T> {
  return (render: RenderFn, defaultProps: DefaultProps<T> = {}): React.ComponentType<Props> =>
    withObservable(call, options)(Div, defaultProps, render);
}
