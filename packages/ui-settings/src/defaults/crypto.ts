// Copyright 2017-2019 @plasm/ui-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from '../types';

export const CRYPTOS: Option[] = [
  {
    info: 'ed25519',
    text: 'Edwards (ed25519)',
    value: 'ed25519'
  },
  {
    info: 'sr25519',
    text: 'Schnorrkel (sr25519)',
    value: 'sr25519'
  }
];
