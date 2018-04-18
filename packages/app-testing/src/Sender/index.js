// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '@polkadot/portal/types';

import './Sender.css';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import Nonce from '@polkadot/rx-react/Nonce';
import withObservableParams from '@polkadot/rx-react/with/observableParams';
import u8aToBn from '@polkadot/util/u8a/toBn';

import Account from '../Account';
import addrSender from '../subject/addrSender';
import nonceSender from '../subject/nonceSender';

type Props = BaseProps & {};

const onNonceChange = (value: Uint8Array) => {
  if (!value || value.length !== 8) {
    return;
  }

  const bn = u8aToBn(value, 64, true);

  console.log('next nonce', bn.toString());

  nonceSender.next(bn);
};

export default function Sender (props: Props) {
  const SenderNonce = withObservableParams(Nonce, addrSender);

  return [
    <Account
      {...props}
      className={['testing--Sender', props.className].join(' ')}
      label='using the selected account'
      subject={addrSender}
    />,
    <div className='testing--split'>
      <div className='small'>
        <Label>with an future index</Label>
        <SenderNonce
          className='ui disabled dropdown selection'
          onChange={onNonceChange}
        />
      </div>
    </div>
  ];
}
