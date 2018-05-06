// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringPair } from '@polkadot/util-keyring/types';

import './PairDisplay.css';

import React from 'react';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';

type Props = {
  className?: string,
  pair: KeyringPair,
  style?: {
    [string]: string
  }
};

export default function PairDisplay ({ className, pair, style }: Props): React$Node {
  const address = pair.address();
  const { name } = pair.getMeta();

  return (
    <div
      className={['ui--InputyAddress-PairDisplay', className].join(' ')}
      style={style}
    >
      <IdentityIcon
        className='ui--InputyAddress-PairDisplay-icon'
        size={32}
        value={address}
      />
      <div className='ui--InputyAddress-PairDisplay-name'>
        {name}
      </div>
      <div className='ui--InputyAddress-PairDisplay-address'>
        {address}
      </div>
    </div>
  );
}
