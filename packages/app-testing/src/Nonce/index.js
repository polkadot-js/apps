// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '@polkadot/portal/types';

import './Nonce.css';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import RxNonce from '@polkadot/rx-react/Nonce';
import withObservableParams from '@polkadot/rx-react/with/observableParams';
import u8aToBn from '@polkadot/util/u8a/toBn';

import addrSender from '../subject/addrSender';
import nonceSender from '../subject/nonceSender';

type Props = BaseProps & {};

const SenderNonce = withObservableParams(RxNonce, addrSender, (pair: KeyringPair) => {
  if (!pair) {
    return new Uint8Array([]);
  }

  return pair.publicKey();
});
const onNonceChange = (value: Uint8Array) => {
  if (!value || value.length !== 8) {
    return;
  }

  nonceSender.next(u8aToBn(value, 64, true));
};

export default function Nonce ({ className, style }: Props) {
  return (
    <div
      className={['testing--split', className].join(' ')}
      style={style}
    >
      <div className='small'>
        <Label>with an index</Label>
        <SenderNonce
          className='ui disabled dropdown selection'
          onChange={onNonceChange}
        />
      </div>
    </div>
  );
}
