// Copyright 2017-2021 @polkadot/ui-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Network } from '@polkadot/networks/types';
import type { Option } from './types';

import known from '@polkadot/networks';

interface NetworkNamed extends Network {
  network: string;
}

const networks = known
  .filter((n): n is NetworkNamed => !!n.network)
  .map(({ displayName, network, prefix }) => ({ info: network, text: displayName, value: prefix }));

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
    ...networks
  ];
}
