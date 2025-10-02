// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

interface Option {
  text: string;
  value: string;
}

export function createDestPrev (t: (key: string, options?: { replace: Record<string, unknown> }) => string): Option[] {
  return [
    { text: t('Stash account (increase the amount at stake)'), value: 'Staked' },
    { text: t('Stash account (do not increase the amount at stake)'), value: 'Stash' },
    { text: t('Controller account'), value: 'Controller' }
  ];
}

export function createDestCurr (t: (key: string, options?: { replace: Record<string, unknown> }) => string): Option[] {
  return createDestPrev(t).concat({ text: t('Specified payment account'), value: 'Account' });
}
