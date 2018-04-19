// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '../types';

import './InputAddress.css';

import React from 'react';
import Dropdown from 'semantic-ui-react/dist/es/modules/Dropdown';

import PairDisplay from './PairDisplay';
import keyring from '../keyring';

type Props = BaseProps & {
  subject: rxjs$Subject<*>
};

const testOptions = keyring.getPairs().map((pair) => {
  const publicKey = pair.publicKey();

  return {
    text: (
      <PairDisplay
        key={publicKey.toString()}
        pair={pair}
      />
    ),
    value: publicKey
  };
});

export default function InputAddress (props: Props): React$Node {
  const onChange = (event, { value }) => {
    if (props.subject) {
      props.subject.next(value);
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
