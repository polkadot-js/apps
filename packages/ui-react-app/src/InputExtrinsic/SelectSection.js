// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '../types';

type Props = BareProps & {
  isError?: boolean,
  label?: string,
  subject?: rxjs$Subject<StateDb$SectionNames>,
  type: 'private' | 'public'
};

const React = require('react');

const RxDropdown = require('../RxDropdown');
const createOptions = require('./options/section');

module.exports = function SelectSection ({ className, isError, label, subject, style, type }: Props): React$Node {
  const options = createOptions(type);

  return (
    <RxDropdown
      className={['ui--InputExtrinsic-SelectSection', className].join(' ')}
      isError={isError}
      label={label}
      options={options}
      style={style}
      subject={subject}
    />
  );
};
