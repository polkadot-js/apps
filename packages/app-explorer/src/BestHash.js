// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import React from 'react';
import withApiCall from '@polkadot/rx-react/with/apiCall';
import u8aToHexShort from '@polkadot/util/u8a/toHexShort';

import calcHash from './calcHash';

function BestHash ({ className, style, value }: any) {
  if (!value) {
    return null;
  }

  const hash = u8aToHexShort(calcHash(value));

  return (
    <div
      className={['explorer--BestHash', className].join(' ')}
      style={style}
    >
      {hash}
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
