// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Header } from '@polkadot/primitives/header';
import type { BaseProps } from './types';

import React from 'react';
import headerHash from '@polkadot/primitives-codec/header/hash';
import withApiCall from '@polkadot/rx-react/with/apiCall';
import u8aToHexShort from '@polkadot/util/u8a/toHexShort';

import translate from './translate';

type Props = BaseProps & {
  value?: Header
};

function BestHash ({ className, style, value }: Props): React$Node {
  if (!value) {
    return null;
  }

  return (
    <div
      className={['explorer--BestHash', className].join(' ')}
      style={style}
    >
      {u8aToHexShort(headerHash(value))}
    </div>
  );
}

export default translate(
  withApiCall({
    method: 'newHead',
    section: 'chain'
  })(BestHash)
);
