// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow
// flowlint sketchy-null-mixed:off

import type { Props } from '../types';

import React from 'react';
import Dropdown from 'semantic-ui-react/dist/es/modules/Dropdown';

import Base from './Base';

const options = [
  { text: 'Super majority approval', value: 0 },
  { text: 'Super majority rejection', value: 1 },
  { text: 'Simple majority', value: 2 }
];

export default function VoteThreshold ({ label, subject, t, value: { options: { initValue = 0 } = {} } }: Props): React$Node {
  const defaultValue = initValue || 0;
  const onChange = (event: SyntheticEvent<*>, { value }) =>
    subject.next({
      isValid: true,
      value
    });

  return (
    <Base
      label={label}
      size='small'
    >
      <Dropdown
        selection
        defaultValue={defaultValue}
        options={options}
        onChange={onChange}
      />
    </Base>
  );
}
