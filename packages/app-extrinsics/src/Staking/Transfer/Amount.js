// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '../../types';

import BN from 'bn.js';
import React from 'react';
import Input from 'semantic-ui-react/dist/es/elements/Input';
import Label from 'semantic-ui-react/dist/es/elements/Label';

import { amount } from './subjects';

type Props = BaseProps & {};

// eslint-disable-next-line no-unused-vars
const onChange = (event: SyntheticEvent<*>, { value }): void => {
  amount.next(
    new BN(value || 0)
  );
};

export default function Amount ({ className, style }: Props) {
  return (
    <div
      className={['extrinsics--split', className].join(' ')}
      style={style}
    >
      <div className='small'>
        <Label>sending an amount of</Label>
        <Input
          defaultValue={0}
          min={0}
          onChange={onChange}
          type='number'
        />
      </div>
    </div>
  );
}
