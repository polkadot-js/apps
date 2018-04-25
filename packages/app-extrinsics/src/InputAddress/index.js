// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import './InputAddress.css';

import React from 'react';
import Dropdown from 'semantic-ui-react/dist/es/modules/Dropdown';
import hexToU8a from '@polkadot/util/hex/toU8a';
import u8aToHex from '@polkadot/util/u8a/toHex';

import PairDisplay from './PairDisplay';
import keyring from '../keyring';

type Props = {
  className?: string,
  style?: {
    [string]: string
  },
  subject: rxjs$Subject<*>
};

const options = keyring.getPairs().map((pair) => ({
  text: (
    <PairDisplay pair={pair} />
  ),
  value: u8aToHex(pair.publicKey())
}));

export default function InputAddress (props: Props): React$Node {
  // eslint-disable-next-line no-unused-vars
  const onChange = (event: SyntheticEvent<*>, { value }): void => {
    if (props.subject) {
      props.subject.next(
        hexToU8a(value)
      );
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
