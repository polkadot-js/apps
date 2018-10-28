// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringSectionOption } from './types';

export default function createHeader (name: string): KeyringSectionOption {
  return {
    className: 'header disabled',
    name,
    key: `header-${name.toLowerCase()}`,
    text: name,
    value: null
  };
}
