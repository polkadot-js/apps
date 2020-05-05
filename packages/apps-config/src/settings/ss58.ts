// Copyright 2017-2020 @polkadot/ui-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from './types';

// Definitions here are with the following values -
//   info: the name of a logo as defined in ../logos, specifically in namedLogos
//   text: The text you wish to display in the dropdown
//   value: The actual ss5Format value (as registered)
export default function create (t: (key: string, text: string, options: { ns: string }) => string): Option[] {
  return [
    {
      info: 'default',
      text: t('ss58.default', 'Default for the connected node', { ns: 'apps-config' }),
      value: -1
    },
    {
      info: 'substrate',
      text: t('ss58.substrate', 'Substrate (generic)', { ns: 'apps-config' }),
      value: 42
    },
    {
      info: 'polkadot',
      text: t('ss58.polkadot', 'Polkadot (live)', { ns: 'apps-config' }),
      value: 0
    },
    {
      info: 'kusama',
      text: t('ss58.kusmaa', 'Kusama (canary)', { ns: 'apps-config' }),
      value: 2
    },
    {
      info: 'edgeware',
      text: t('ss58.edgeware', 'Edgeware (live)', { ns: 'apps-config' }),
      value: 7
    },
    {
      info: 'centrifuge',
      text: t('ss58.centrifuge', 'Centrifuge (live)', { ns: 'apps-config' }),
      value: 36
    }
  ];
}
