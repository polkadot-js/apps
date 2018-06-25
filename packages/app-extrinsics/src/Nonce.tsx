// Copyright 2017-2018 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';
import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';

import Labelled from '@polkadot/ui-app/Labelled';
import classes from '@polkadot/ui-app/util/classes';
import RxNonce from '@polkadot/ui-react-rx/Nonce';

type Props = BareProps & {
  label: string,
  onChange: (value: BN) => void,
  value?: Uint8Array
};

export default function Nonce ({ className, label, style, onChange, value }: Props) {
  return (
    <div
      className={classes('ui--row', className)}
      style={style}
    >
      <Labelled
        className='small'
        label={label}
      >
        <RxNonce
          className='ui disabled dropdown selection'
          onChange={onChange}
          params={value}
        />
      </Labelled>
    </div>
  );
}
