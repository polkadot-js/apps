// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic, ExtrinsicSectionName } from '@polkadot/extrinsics/types';
import type { BareProps } from '../types';

type Props = BareProps & {
  isError?: boolean,
  isPrivate: boolean,
  onChange?: (event: SyntheticEvent<*>, value: Extrinsic) => void,
  subject?: rxjs$Subject<Extrinsic>,
  value?: ExtrinsicSectionName
};

const React = require('react');
const extrinsics = require('@polkadot/extrinsics-substrate/src');

const RxDropdown = require('../RxDropdown');
const createOptions = require('./options/method');

module.exports = function SelectMethod ({ className, isError, isPrivate, onChange, style, subject, value }: Props): React$Node {
  if (!value || !extrinsics[value]) {
    return null;
  }

  const transform = (name: string): Extrinsic =>
    extrinsics[value].methods[isPrivate ? 'private' : 'public'][name];
  const options = createOptions(value, isPrivate);

  return (
    <RxDropdown
      className={['ui--InputExtrinsic-SelectMethod', className].join(' ')}
      isError={isError}
      onChange={onChange}
      options={options}
      style={style}
      subject={subject}
      transform={transform}
    />
  );
};
