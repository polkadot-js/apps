// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from './types';

import React from 'react';

import Labelled from './Labelled';

type Props = BareProps & {
  children?: React$Node,
  label?: React$Node,
  value?: mixed,
  withLabel?: boolean
};

export default function Output ({ className, children, label, style, value, withLabel }: Props): React$Node {
  return (
    <Labelled
      className={className}
      label={label}
      style={style}
      withLabel={withLabel}
    >
      <div className='ui--output'>
        {value}{children}
      </div>
    </Labelled>
  );
}
