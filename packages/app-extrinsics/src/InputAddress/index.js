// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// TODO: This is a useful, shared component, move out

import './InputAddress.css';

import React from 'react';
import Dropdown from 'semantic-ui-react/dist/es/modules/Dropdown';
import hexToU8a from '@polkadot/util/hex/toU8a';
import u8aToHex from '@polkadot/util/u8a/toHex';

import PairDisplay from './PairDisplay';
import keyring from '../keyring';

type Props = {
  className?: string,
  isError?: boolean,
  onChange?: (event: SyntheticEvent<*>, value: Uint8Array) => void,
  style?: {
    [string]: string
  },
  subject?: rxjs$Subject<*>
};

const options = keyring.getPairs().map((pair) => ({
  text: (
    <PairDisplay pair={pair} />
  ),
  value: u8aToHex(pair.publicKey())
}));

export default function InputAddress (props: Props): React$Node {
  const onChange = (event: SyntheticEvent<*>, { value }): void => {
    const u8a = hexToU8a(value);

    if (props.subject) {
      props.subject.next(u8a);
    }

    if (props.onChange) {
      props.onChange(event, u8a);
    }
  };

  const _props = {...props};

  delete _props.isError;

  return (
    <Dropdown
      selection
      {..._props}
      className={['ui--InputAddress', props.className].join(' ')}
      error={props.isError}
      options={options}
      onChange={onChange}
    />
  );
}
