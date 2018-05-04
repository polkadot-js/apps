// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '../types';

import React from 'react';

import RxDropdown from '../RxDropdown';

type Props = BareProps & {
  createOptions: () => Array<*>,
  isError?: boolean,
  label?: string,
  subject: rxjs$BehaviorSubject<string>
};

export default function SelectSection ({ className, createOptions, isError, label, subject, style }: Props): React$Node {
  return (
    <RxDropdown
      className={['ui--RxDropdownLinked-Sections', className].join(' ')}
      defaultValue={subject.getValue()}
      isError={isError}
      label={label}
      options={createOptions()}
      style={style}
      subject={subject}
    />
  );
}
