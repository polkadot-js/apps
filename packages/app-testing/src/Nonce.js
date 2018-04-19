// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from './types';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import RxNonce from '@polkadot/rx-react/Nonce';
import withObservableParams from '@polkadot/rx-react/with/observableParams';
import u8aToBn from '@polkadot/util/u8a/toBn';

import { senderAddr, senderIndex } from './subjects';

type Props = BaseProps & {};

const SenderNonce = withObservableParams(RxNonce, senderAddr);
const onNonceChange = (value) => {
  // flowlint-next-line sketchy-null-mixed:off
  if (!value || value.length !== 8) {
    return;
  }

  senderIndex.next(
    // flowlint-next-line unclear-type:off
    u8aToBn(((value: any): Uint8Array), true)
  );
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
          classNameUpdated='hasUpdated'
          onChange={onNonceChange}
        />
      </div>
    </div>
  );
}
