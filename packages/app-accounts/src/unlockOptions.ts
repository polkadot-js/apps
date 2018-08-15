// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { TranslationFunction } from 'i18next';
import { UnlockStrategy } from './types';

type Option = {
  text: string,
  value: UnlockStrategy
};

const options: Array<Option> = [
  { text: 'Require password for each use', value: 'use' },
  { text: 'Require password once per session', value: 'session' }
];

export default function createOptions (t: TranslationFunction): Array<Option> {
  return [
    {
      text: t('unlockOptions.use', {
        defaultValue: 'Require password for each use'
      }),
      value: 'use'
    },
    {
      text: t('unlockOptions.session', {
        defaultValue: 'Require password once per session'
      }),
      value: 'session'
    }
  ];
}
