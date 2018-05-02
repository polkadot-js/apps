// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '../types';

type Props = BareProps & {
  isPrivate: boolean,
  isError?: boolean,
  subject?: rxjs$Subject<StateDb$SectionNames>
};

const React = require('react');

const RxDropdown = require('../RxDropdown');
const createOptions = require('./options/section');

module.exports = function SelectSection ({ className, isError, isPrivate, subject, style }: Props): React$Node {
  const options = createOptions(isPrivate);

  return (
    <RxDropdown
      className={['ui--InputExtrinsic-SelectSection', className].join(' ')}
      isError={isError}
      options={options}
      style={style}
      subject={subject}
    />
  );
};
