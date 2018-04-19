// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from './types';

import React from 'react';
import Dropdown from 'semantic-ui-react/dist/es/modules/Dropdown';
import Label from 'semantic-ui-react/dist/es/elements/Label';

import { extrinsicName } from './subjects';
import extrinsics from './extrinsics';

type Props = BaseProps & {};

// eslint-disable-next-line no-unused-vars
const onChange = (event: SyntheticEvent<*>, { value }): void => {
  extrinsicName.next(value);
};

const options = Object.keys(extrinsics).map((value) => ({
  text: extrinsics[value].description,
  value
}));

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
          options={options}
        />
      </div>
    </div>
  );
}
