// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from './types';

// These are the available languages. For each there are translation files available
// in packages/apps/public/locales (Don't edit unless adding a new translation)
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
  }
  // For ja, we only have the settings page, remove until comprehensive
  // , {
  //   text: '日本語',
  //   value: 'ja'
  // }
].map((option): Option => ({ ...option }));
