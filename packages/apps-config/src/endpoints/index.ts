// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from '../settings/types';

import { createCustom, createDev, createOwn } from './development';
import { createProduction } from './production';
import { createTesting } from './testing';

export { CUSTOM_ENDPOINT_KEY } from './development';

function expand (input: LinkOption[]): LinkOption[] {
  return input.reduce((result: LinkOption[], entry): LinkOption[] => {
    result.push(entry);

    return entry.linked
      ? result.concat(
        expand(entry.linked).map((entry): LinkOption => {
          entry.isChild = true;

          return entry;
        })
      )
      : result;
  }, []);
}

export function createWsEndpoints (t: TFunction): LinkOption[] {
  return expand([
    ...createCustom(t),
    {
      isDisabled: false,
      isHeader: true,
      text: t('rpc.header.live', 'Live networks', { ns: 'apps-config' }),
      textBy: '',
      value: ''
    },
    ...createProduction(t),
    {
      isDisabled: false,
      isHeader: true,
      text: t('rpc.header.test', 'Test networks', { ns: 'apps-config' }),
      textBy: '',
      value: ''
    },
    ...createTesting(t),
    {
      isDevelopment: true,
      isDisabled: false,
      isHeader: true,
      text: t('rpc.header.dev', 'Development', { ns: 'apps-config' }),
      textBy: '',
      value: ''
    },
    ...createDev(t),
    ...createOwn(t)
  ]).filter(({ isDisabled }) => !isDisabled);
}
