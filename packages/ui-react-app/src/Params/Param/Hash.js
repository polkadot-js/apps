// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props } from '../types';

import React from 'react';

import Bytes from './Bytes';

export default function Hash ({ isError, label, subject, value }: Props): React$Node {
  return (
    <Bytes
      isError={isError}
      label={label}
      length={32}
      size='medium'
      subject={subject}
      value={value}
    />
  );
}
