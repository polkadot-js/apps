// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props } from '../types';

const React = require('react');
const Dropdown = require('semantic-ui-react/dist/es/modules/Dropdown').default;

const Base = require('./Base');

const options = [
  { text: 'No', value: false },
  { text: 'Yes', value: true }
];

module.exports = function Bool ({ isError, label, subject, t, value: { options: { initValue = false } = {} } }: Props): React$Node {
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
        error={isError}
        selection
        defaultValue={initValue}
        options={options}
        onChange={onChange}
      />
    </Base>
  );
};
