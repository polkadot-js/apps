// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Storage$Key } from '@polkadot/storage/types';
import type { BaseProps } from '../types';
import type { ComponentRenderer, DefaultProps, RenderFn, StorageOptions } from './types';

import Div from '../Div';
import withStorage from './storage';

export default function withStorageDiv<T, Props: BaseProps<T>> (key: Storage$Key, options?: StorageOptions<T>): ComponentRenderer<T> {
  return (render: RenderFn, defaultProps?: DefaultProps<T> = {}): React$ComponentType<Props> =>
    withStorage(key, options)(Div, {
      ...defaultProps,
      render
    });
}
