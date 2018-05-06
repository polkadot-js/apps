// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Header } from '@polkadot/primitives/header';

import React from 'react';
import withApiDiv from '@polkadot/rx-react/with/apiDiv';

import BlockHeader from './BlockHeader';

let blockHeaders: Array<Header> = [];

const apiMethod = {
  name: 'newHead',
  section: 'chain'
};

const apiOptions = {
  transform: (header: Header): Array<Header> => {
    if (!header) {
      return blockHeaders;
    }

    blockHeaders = blockHeaders
      .filter((header, index) => index < 9)
      .reduce((next, header) => {
        next.push(header);

        return next;
      }, [header]);

    return blockHeaders;
  }
};

export default withApiDiv(apiMethod, apiOptions)(
  (value?: Array<Header> = []): Array<React$Node> => {
    return value.map((value) => (
      <BlockHeader
        key={value.number.toString()}
        value={value}
      />
    ));
  },
  { className: 'explorer--BlockHeaders' }
);
