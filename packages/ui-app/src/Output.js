// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from './types';

import React from 'react';

import CopyButton from './CopyButton';
import Labelled from './Labelled';

type Props = BareProps & {
  children?: React$Node,
  isHidden?: boolean,
  label?: React$Node,
  value?: mixed,
  withCopy?: boolean,
  withLabel?: boolean
};

export default function Output ({ className, children, isHidden, label, style, value, withCopy = false, withLabel }: Props): React$Node {
  return (
    <Labelled
      className={className}
      isHidden={isHidden}
      label={label}
      style={style}
      withLabel={withLabel}
    >
      <div className='ui--output'>
        {
          // flowlint-next-line unclear-type:off
          ((value: any): React$Node)
        }
        {children}
        {
          withCopy
            ? (
              <CopyButton className='ui--output-button' value={value} />
            )
            : null
        }
      </div>
    </Labelled>
  );
}
