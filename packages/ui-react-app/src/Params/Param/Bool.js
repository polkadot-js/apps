// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props } from '../types';

import React from 'react';
import Dropdown from 'semantic-ui-react/dist/es/modules/Dropdown';

import doChange from '../../util/doChange';
import Base from './Base';

const options = [
  { text: 'No', value: false },
  { text: 'Yes', value: true }
];

export default function Bool ({ isError, label, onChange, t, value: { options: { initValue = false } = {} } }: Props): React$Node {
  const _onChange = (event: SyntheticEvent<*>, { value }) =>
    doChange({
      isValid: true,
      value
    }, onChange);

  return (
    <Base
      label={label}
      size='small'
    >
      <Dropdown
        error={isError}
        selection
        defaultValue={initValue}
        options={options}
        onChange={_onChange}
      />
    </Base>
  );
}
