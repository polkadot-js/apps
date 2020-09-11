// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TFunction } from 'i18next';

interface Option {
  text: string;
  value: string;
}

export function createDestPrev (t: TFunction): Option[] {
  return [
    { text: t('Stash account (increase the amount at stake)'), value: 'Staked' },
    { text: t('Stash account (do not increase the amount at stake)'), value: 'Stash' },
    { text: t('Controller account'), value: 'Controller' }
  ];
}

export function createDestCurr (t: TFunction): Option[] {
  return createDestPrev(t).concat({ text: t('Specified payment account'), value: 'Account' });
}
