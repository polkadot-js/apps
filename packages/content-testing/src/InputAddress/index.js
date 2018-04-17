// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '@polkadot/portal/types';

import './InputAddress.css';

import React from 'react';
import Dropdown from 'semantic-ui-react/dist/es/modules/Dropdown';

import PairDisplay from './PairDisplay';
import keyring from '../keyring';

type Props = BaseProps & {
  subject: rxjs$Subject
};

const testOptions = Object.keys(keyring).map((name) => ({
  text: (
    <PairDisplay
      key={name}
      name={name}
      pair={keyring[name]}
    />
  ),
  value: name
}));

export default function InputAddress (_props: Props): React$Node {
  const props = Object.assign({}, _props, {
    className: ['ui--InputAddress', _props.className].join(' ')
  });
  const onChange = (_, { value }) => {
    if (_props.subject) {
      _props.subject.next(keyring[value]);
    }
  };

  return (
    <Dropdown
      search
      selection
      options={testOptions}
      onChange={onChange}
      {...props}
    />
  );
}
