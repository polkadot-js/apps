// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';

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
