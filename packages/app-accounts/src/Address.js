// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '@polkadot/ui-react-app/types';

import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import Balance from '@polkadot/ui-react-rx/Balance';
import Nonce from '@polkadot/ui-react-rx/Nonce';

type Props = BareProps & {
  value: null | {
    address: string,
    publicKey: Uint8Array
  };
}

export default function Address ({ className, style, value }: Props): React$Node {
  if (!value) {
    return null;
  }

  const { address, publicKey } = value;
  const short = `${address.slice(0, 7)}…${address.slice(-7)}`;

  return (
    <div
      className={['accounts--Address', className].join(' ')}
      style={style}
    >
      <IdentityIcon
        className='accounts--Address-icon'
        size={96}
        value={address}
      />
      <div className='accounts--Address-data'>
        <div className='accounts--Address-address'>
          {short}
        </div>
        <CopyToClipboard text={address}>
          <Button
            icon='copy'
            primary
            size='tiny'
          />
        </CopyToClipboard>
      </div>
      <Balance
        className='accounts--Address-balance'
        label='balance '
        value={publicKey}
      />
      <Nonce
        className='accounts--Address-nonce'
        value={publicKey}
      >
        {' transactions'}
      </Nonce>
    </div>
  );
}
