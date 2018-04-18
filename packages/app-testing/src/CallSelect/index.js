// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '@polkadot/portal/types';

import './CallSelect.css';

import React from 'react';
import Dropdown from 'semantic-ui-react/dist/es/modules/Dropdown';
import Label from 'semantic-ui-react/dist/es/elements/Label';

import extrinsicName from '../subject/extrinsicName';

type Props = BaseProps & {};

const callOptions = [
  {
    text: 'Staking Transfer',
    value: 'staking_transfer'
  }
];

const onChange = (_, { value }) => {
  extrinsicName.next(value);
};

export default function CallSelect ({ className, style }: Props) {
  return (
    <div
      className={['testing--CallSelect', 'testing--split', className].join(' ')}
      style={style}
    >
      <div className='large'>
        <Label>submit the following extrinsic</Label>
        <Dropdown
          selection
          onChange={onChange}
          options={callOptions}
        />
      </div>
    </div>
  );
}
