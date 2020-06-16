// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from './types';

export default function create (t: <T= string> (key: string, text: string, options: { ns: string }) => T): Option[] {
  return [
    {
      text: t<string>('lng.detect', 'Default browser language (auto-detect)', { ns: 'apps-config' }),
      value: 'default'
    },
    {
      text: 'English',
      value: 'en'
    },
    {
      text: 'Português',
      value: 'pt'
    },
    {
      text: '汉语',
      value: 'zh'
    },
    {
      text: 'русский',
      value: 'ru'
    },
    {
      text: '日本語',
      value: 'ja'
    }
  ];
}
