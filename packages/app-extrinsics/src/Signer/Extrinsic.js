// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps, QueueTx } from '../types';

import React from 'react';
import Modal from 'semantic-ui-react/dist/es/modules/Modal';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import u8aToHex from '@polkadot/util/u8a/toHex';
import u8aToHexShort from '@polkadot/util/u8a/toHexShort';

type Props = BaseProps & {
  value: QueueTx
};

export default function Extrinsic ({ className, style, value: { message, method, publicKey } }: Props): React$Node {
  return (
    <Modal.Content
      className={['extrinsics--Signer-Extrinsic', className].join(' ')}
      style={style}
    >
      <div className='body'>
        <IdentityIcon
          address={publicKey}
          className='icon'
        />
        <div className='expanded'>
          <p>You are about to sign a message from <span className='code'>{u8aToHexShort(publicKey)}</span> calling <span className='code'>{method}</span></p>
          <p>The encoded message to be signed contains the data</p>
          <p className='code'>{u8aToHex(message)}</p>
        </div>
      </div>
    </Modal.Content>
  );
}
