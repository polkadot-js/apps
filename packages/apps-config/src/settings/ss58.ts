// Copyright 2017-2020 @polkadot/ui-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';

import known from '@polkadot/networks';

import type { Option } from './types';

// Definitions here are with the following values -
//   info: the name of a logo as defined in ../logos, specifically in namedLogos
//   text: The text you wish to display in the dropdown
//   value: The actual ss5Format value (as registered)

export function createSs58 (t: TFunction): Option[] {
  return [
    {
      info: 'default',
      text: t('ss58.default', 'Default for the connected node', { ns: 'apps-config' }),
      value: -1
    },
    ...known.map(({ displayName, network, prefix }): Option => ({
      info: network,
      text: displayName,
      value: prefix
    }))
  ];
}
