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

export default function InputAddress (props: Props): React$Node {
  const onChange = (_, { value }) => {
    if (props.subject) {
      props.subject.next(keyring[value]);
    }
  };

  return (
    <Dropdown
      {...props}
      className={['ui--InputAddress', props.className].join(' ')}
      selection
      options={testOptions}
      onChange={onChange}
    />
  );
}
