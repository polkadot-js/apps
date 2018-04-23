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

const options = keyring.getPairs().map((pair) => {
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
  // eslint-disable-next-line no-unused-vars
  const onChange = (event: SyntheticEvent<*>, { value }): void => {
    if (props.subject) {
      props.subject.next(value);
    }
  };

  return (
    <Dropdown
      {...props}
      className={['ui--InputAddress', props.className].join(' ')}
      selection
      options={options}
      onChange={onChange}
    />
  );
}
