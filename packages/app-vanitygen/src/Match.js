// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '@polkadot/ui-react-app/types';

import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import u8aToHex from '@polkadot/util/u8a/toHex';

type Props = BareProps & {
  address: string;
  count: number;
  offset: number;
  onRemove: (address: string) => void,
  seed: Uint8Array;
}

export default function Match ({ address, className, count, offset, onRemove, seed, style }: Props): React$Node {
  const _onRemove = (): void =>
    onRemove(address);
  const hexSeed = u8aToHex(seed);

  return (
    <div
      className={['vanity--Match', className].join(' ')}
      style={style}
    >
      <div className='vanity--Match-item'>
        <IdentityIcon
          className='vanity--Match-icon'
          size={48}
          value={address}
        />
        <div className='vanity--Match-data'>
          <div className='vanity--Match-addr'>
            <span className='no'>{address.slice(0, offset)}</span><span className='yes'>{address.slice(offset, count + offset)}</span><span className='no'>{address.slice(count + offset)}</span>
          </div>
          <div className='vanity--Match-seed'>
            {hexSeed}
          </div>
        </div>
        <div className='vanity--Match-buttons'>
          <CopyToClipboard text={hexSeed}>
            <Button
              icon='copy'
              primary
              size='tiny'
            />
          </CopyToClipboard>
          <Button
            icon='close'
            negative
            onClick={_onRemove}
            size='tiny'
          />
        </div>
      </div>
    </div>
  );
}
