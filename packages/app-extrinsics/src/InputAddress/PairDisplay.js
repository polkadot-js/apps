// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringPair } from '@polkadot/util-keyring/types';
import type { BaseProps } from '../types';

import './PairDisplay.css';

import React from 'react';
import { translate } from 'react-i18next';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import u8aToHex from '@polkadot/util/u8a/toHex';

type Props = BaseProps & {
  pair: KeyringPair
};

function PairDisplay ({ className, pair, style }: Props): React$Node {
  const publicKey = pair.publicKey();
  const { name } = pair.getMeta();

  return (
    <div
      className={['ui--InputyAddress-PairDisplay', className].join(' ')}
      style={style}
    >
      <IdentityIcon
        className='ui--InputyAddress-PairDisplay-icon'
        size={32}
        value={publicKey}
      />
      <div className='ui--InputyAddress-PairDisplay-name'>
        {name}
      </div>
      <div className='ui--InputyAddress-PairDisplay-address'>
        {u8aToHex(publicKey)}
      </div>
    </div>
  );
}

export default translate(['extrinsics'])(PairDisplay);
