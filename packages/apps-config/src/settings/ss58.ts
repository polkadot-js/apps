// Copyright 2017-2020 @polkadot/ui-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from './types';

// Definitions here are with the following values -
//   info: the name of a logo as defined in ../logos, specifically in namedLogos
//   text: The text you wish to display in the dropdown
//   value: The actual ss5Format value (as registered)
export default function create (t: (key: string, options: { ns: string }) => string): Option[] {
  return [
    {
      info: 'default',
      text: t('Default for the connected node', { ns: 'apps-config' }),
      value: -1
    },
    {
      info: 'substrate',
      text: t('Substrate (generic)', { ns: 'apps-config' }),
      value: 42
    },
    {
      info: 'polkadot',
      text: t('Polkadot (live)', { ns: 'apps-config' }),
      value: 0
    },
    {
      info: 'kusama',
      text: t('Kusama (canary)', { ns: 'apps-config' }),
      value: 2
    },
    {
      info: 'edgeware',
      text: t('Edgeware (live)', { ns: 'apps-config' }),
      value: 7
    },
    {
      info: 'centrifuge',
      text: t('Centrifuge (live)', { ns: 'apps-config' }),
      value: 36
    }
  ];
}
