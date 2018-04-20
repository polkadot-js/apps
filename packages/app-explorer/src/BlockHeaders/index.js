// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import './BlockHeaders.css';

import React from 'react';
import withApiCall from '@polkadot/rx-react/with/apiCall';

import { blockHeaders } from '../subjects';
import BlockHeader from './BlockHeader';
import transform from './transform';

function BlockHeaders ({ className, style, value }: any) {
  const currentNumber = value && value.length
    ? value[0].header.number.toString()
    : 'unknown';

  return (
    <div
      className={['explorer--BlockHeaders', className].join(' ')}
      data-latest={currentNumber}
      style={style}
    >
      {
        (value || []).map(({ hash, header }) => (
          <BlockHeader
            hash={hash}
            header={header}
            key={hash}
          />
        ))
      }
    </div>
  );
}

export default withApiCall(
  BlockHeaders,
  {
    method: 'newHead',
    section: 'chain'
  },
  {
    subject: blockHeaders,
    transform
  }
);
