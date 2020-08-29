// Copyright 2017-2020 @polkadot/ui-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TFunction } from 'i18next';
import { Option } from './types';

// Definitions here are with the following values -
//   info: the name of a logo as defined in ../logos, specifically in namedLogos
//   text: The text you wish to display in the dropdown
//   value: The actual ss5Format value (as registered)
export default function create (t: TFunction): Option[] {
  return [
    // base defaults
    {
      info: 'default',
      text: t<string>('ss58.default', 'Default for the connected node', { ns: 'apps-config' }),
      value: -1
    },
    {
      info: 'polkadot',
      text: t<string>('ss58.polkadot', 'Polkadot (live)', { ns: 'apps-config' }),
      value: 0
    },
    {
      info: 'kusama',
      text: t<string>('ss58.kusama', 'Kusama (canary)', { ns: 'apps-config' }),
      value: 2
    },
    {
      info: 'substrate',
      text: t<string>('ss58.substrate', 'Substrate (generic)', { ns: 'apps-config' }),
      value: 42
    },
    // alphabetical extended chains
    {
      info: 'centrifuge',
      text: t<string>('ss58.centrifuge', 'Centrifuge (live)', { ns: 'apps-config' }),
      value: 36
    },
    {
      info: 'edgeware',
      text: t<string>('ss58.edgeware', 'Edgeware (live)', { ns: 'apps-config' }),
      value: 7
    },
    {
      info: 'plasm',
      text: t<string>('ss58.plasm', 'Plasm (live)', { ns: 'apps-config' }),
      value: 5
    },
    {
      info: 'subsocial',
      text: t<string>('ss58.subsocial', 'Subsocial (live)', { ns: 'apps-config' }),
      value: 28
    }
  ];
}
