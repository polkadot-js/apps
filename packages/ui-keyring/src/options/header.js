// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringOption } from '../types';

export default function createHeader (name: string): KeyringOption {
  return {
    className: 'header disabled',
    name,
    key: `header-${name.toLowerCase()}`,
    text: name,
    value: null
  };
}
