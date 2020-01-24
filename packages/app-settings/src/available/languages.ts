// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from '../types';

export default [
  {
    text: 'Default browser language (auto-detect)',
    value: 'default',
    withI18n: true
  },
  {
    text: 'English',
    value: 'en'
  },
  {
    text: '汉语',
    value: 'zh'
  },
  {
    text: '日本語',
    value: 'ja'
  }
] as Option[];
