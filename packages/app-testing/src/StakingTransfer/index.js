// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '@polkadot/portal/types';

import './StakingTransfer.css';

import BN from 'bn.js';
import React from 'react';
import Input from 'semantic-ui-react/dist/es/elements/Input';
import Label from 'semantic-ui-react/dist/es/elements/Label';

import Recipient from '../Recipient';
import getValues from './getValues';
import { amount } from './subjects';

type Props = BaseProps & {};

const onChangeAmount = (event, { value }) => {
  amount.next(
    new BN(value || 0)
  );
};

function StakingTransfer ({ className, style }: Props) {
  return (
    <div
      className={['testing--StakingTransfer', className].join(' ')}
      style={style}
    >
      <div className='testing--split'>
        <div className='small'>
          <Label>sending an amount of</Label>
          <Input
            defaultValue={0}
            min={0}
            onChange={onChangeAmount}
            type='number'
          />
        </div>
      </div>

      <Recipient />
    </div>
  );
}

StakingTransfer.getValues = getValues;

export default StakingTransfer;
