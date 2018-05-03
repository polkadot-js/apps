// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '../types';

type Props = BareProps & {
  isError?: boolean,
  label?: string,
  onChange?: (event: SyntheticEvent<*>, value: Uint8Array) => void,
  subject?: rxjs$Subject<*>
};

require('./InputAddress.css');

const React = require('react');
const hexToU8a = require('@polkadot/util/hex/toU8a');
const u8aToHex = require('@polkadot/util/u8a/toHex');

// TODO: We need to actually pass the keyring in, this is the testing keyring
const keyring = require('../keyring');
const RxDropdown = require('../RxDropdown');
const PairDisplay = require('./PairDisplay');

const options = keyring.getPairs().map((pair) => ({
  text: (
    <PairDisplay pair={pair} />
  ),
  value: u8aToHex(pair.publicKey())
}));

const transform = (value: string): Uint8Array =>
  hexToU8a(value);

module.exports = function InputAddress ({ className, isError, label, onChange, style, subject }: Props): React$Node {
  return (
    <RxDropdown
      className={['ui--InputAddress', className].join(' ')}
      isError={isError}
      label={label}
      onChange={onChange}
      options={options}
      subject={subject}
      transform={transform}
    />
  );
};
