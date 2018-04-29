// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from './types';

import React from 'react';

import findComponent from './findComponent';
import typeToText from './typeToText';

type Props = BaseProps & {
  label?: string;
}

export default function Param ({ className, label, style, subject, value }: Props): React$Node {
  // flowlint-next-line sketchy-null-string:off
  const defaultLabel = label || `${value.name}: ${typeToText(value.type)}`;
  const Component = findComponent(value.type);

  return (
    <Component
      className={className}
      label={defaultLabel}
      style={style}
      subject={subject}
      value={value}
    />
  );
}
