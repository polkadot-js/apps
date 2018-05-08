// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type BN from 'bn.js';
import type { BareProps } from '@polkadot/ui-react-app/types';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import RxNonce from '@polkadot/ui-react-rx/Nonce';

type Props = BareProps & {
  label: string,
  onChange: (value: BN) => void,
  value?: Uint8Array
};

export default function Nonce ({ className, label, style, onChange, value }: Props): React$Node {
  return (
    <div
      className={['ui--form', className].join(' ')}
      style={style}
    >
      <div className='small'>
        <Label>{label}</Label>
        <RxNonce
          className='ui disabled dropdown selection'
          onChange={onChange}
          params={value}
        />
      </div>
    </div>
  );
}
