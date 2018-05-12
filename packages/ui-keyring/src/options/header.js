// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import React from 'react';
import Dropdown from 'semantic-ui-react/dist/es/modules/Dropdown';

export default function createHeader (text: string): React$Element<*> {
  return (
    <Dropdown.Header key={`header-${text.toLowerCase()}`}>
      {text}
    </Dropdown.Header>
  );
}
