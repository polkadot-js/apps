// Copyright 2017-2020 @polkadot/ui-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from './types';

// Definitions here are with the following values -
//   info: the name of a logo as defined in ../logos, specifically in namedLogos
//   text: The text you wish to display in the dropdown
//   value: The actual ss5Format value (as registered)
export default [
  {
    info: 'default',
    text: 'Default for the connected node',
    value: -1
  },
  {
    info: 'substrate',
    text: 'Substrate (generic)',
    value: 42
  },
  {
    info: 'polkadot',
    text: 'Polkadot (live)',
    value: 0
  },
  {
    info: 'kusama',
    text: 'Kusama (canary)',
    value: 2
  },
  {
    info: 'edgeware',
    text: 'Edgeware (live)',
    value: 7
  },
  {
    info: 'centrifuge',
    text: 'Centrifuge (live)',
    value: 36
  }
].map((option): Option => ({ ...option, withI18n: true }));
