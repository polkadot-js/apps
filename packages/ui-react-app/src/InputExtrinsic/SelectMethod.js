// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic, ExtrinsicSectionName } from '@polkadot/extrinsics/types';
import type { BareProps } from '../types';

type Props = BareProps & {
  isError?: boolean,
  label?: string,
  onChange?: (event: SyntheticEvent<*>, value: Extrinsic) => void,
  subject?: rxjs$Subject<Extrinsic>,
  type: 'private' | 'public',
  value?: ExtrinsicSectionName
};

const React = require('react');
const extrinsics = require('@polkadot/extrinsics-substrate');

const RxDropdown = require('../RxDropdown');
const createOptions = require('./options/method');

module.exports = function SelectMethod ({ className, isError, label, onChange, style, subject, type, value }: Props): React$Node {
  if (!value || !extrinsics[value]) {
    return null;
  }

  const methods = extrinsics[value].methods[type];
  const transform = (name: string): Extrinsic =>
    methods[name];
  const options = createOptions(value, type);

  return (
    <RxDropdown
      className={['ui--InputExtrinsic-SelectMethod', className].join(' ')}
      isError={isError}
      label={label}
      onChange={onChange}
      options={options}
      style={style}
      subject={subject}
      transform={transform}
    />
  );
};
