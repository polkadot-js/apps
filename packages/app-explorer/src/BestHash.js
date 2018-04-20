// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import React from 'react';
import withApiCall from '@polkadot/rx-react/with/apiCall';
import u8aToHex from '@polkadot/util/u8a/toHex';

import calcHash from './calcHash';

function BestHash ({ className, style, value }: any) {
  if (!value) {
    return null;
  }

  const hash = u8aToHex(calcHash(value));
  const trimmed = `${hash.substr(0, 10)}...${hash.slice(-8)}`;

  return (
    <div
      className={['explorer--BestHash', className].join(' ')}
      style={style}
    >
      {trimmed}
    </div>
  );
}

export default withApiCall(
  BestHash,
  {
    method: 'newHead',
    section: 'chain'
  }
);
