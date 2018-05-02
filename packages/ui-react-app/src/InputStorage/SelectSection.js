// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '../types';

type Props = BareProps & {
  isError?: boolean,
  subject?: rxjs$Subject<StateDb$SectionNames>
};

const React = require('react');

const RxDropdown = require('../RxDropdown');
const createOptions = require('./options/section');

const options = createOptions();

module.exports = function SelectSection ({ className, isError, subject, style }: Props): React$Node {
  return (
    <RxDropdown
      className={['ui--InputStorage-SelectSection', className].join(' ')}
      isError={isError}
      options={options}
      style={style}
      subject={subject}
    />
  );
};
