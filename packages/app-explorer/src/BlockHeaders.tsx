// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Header } from '@polkadot/primitives/header';

import React from 'react';

import withApiDiv from '@polkadot/ui-react-rx/with/apiDiv';

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
      .filter((old, index) =>
        index < 9 && old.number.lt(header.number)
      )
      .reduce((next, header) => {
        next.push(header);

        return next;
      }, [header])
      .sort((a, b) =>
        b.number.cmp(a.number)
      );

    return blockHeaders;
  }
};

export default withApiDiv(apiMethod, apiOptions)(
  (value: Array<Header> = []) =>
    value.map((value) => (
      <BlockHeader
        key={value.number.toString()}
        value={value}
      />
    )),
  { className: 'explorer--BlockHeaders' }
);
