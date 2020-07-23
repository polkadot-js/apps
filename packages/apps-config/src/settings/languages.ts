// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TFunction } from 'i18next';
import { Option } from './types';

export default function create (t: TFunction): Option[] {
  return [
    {
      text: t<string>('lng.detect', 'Default browser language (auto-detect)', { ns: 'apps-config' }),
      value: 'default'
    },
    // default/native
    {
      text: 'English',
      value: 'en'
    },
    // translations (sorted by language code)
    {
      text: 'عربى',
      value: 'ar'
    },
    {
      text: 'Español',
      value: 'es'
    },
    {
      text: '日本語',
      value: 'ja'
    },
    {
      text: 'Português',
      value: 'pt'
    },
    {
      text: 'русский',
      value: 'ru'
    },
    {
      text: '汉语',
      value: 'zh'
    }
  ];
}
