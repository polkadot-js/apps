// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { SectionItem } from '@polkadot/params/types';
import { Storages } from '@polkadot/storage/types';
import { BaseProps } from '../types';
import { ComponentRenderer, DefaultProps, RenderFn, StorageOptions } from './types';

import Div from '../Div';
import withStorage from './storage';

export default function withStorageDiv<T, Props extends BaseProps<T>> (key: SectionItem<Storages>, options?: StorageOptions<T>): ComponentRenderer<T> {
  return (render: RenderFn, defaultProps: DefaultProps<T> = {}): React.ComponentType<Props> =>
    withStorage(key, options)(Div, {
      ...defaultProps,
      render
    });
}
