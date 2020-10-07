// Copyright 2017-2020 @canvas-ui/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
