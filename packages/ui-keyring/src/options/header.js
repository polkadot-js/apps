// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringOption } from '../types';

// import React from 'react';
// import Dropdown from 'semantic-ui-react/dist/es/modules/Dropdown';

export default function createHeader (text: string): $Shape<KeyringOption> {
  // HACK We add our own header and make it look like SUI, the below type renders more than once when searching through
  //  <Dropdown.Header>Addresses</Dropdown.Header>
  return {
    className: 'ui--KeyPair-header',
    disabled: true,
    key: `header-${text.toLowerCase()}`,
    content: text
  };
}
