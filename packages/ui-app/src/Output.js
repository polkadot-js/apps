// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from './types';

import React from 'react';

import CopyButton from './CopyButton';
import Labelled from './Labelled';
import classes from './util/classes';

type Props = BareProps & {
  children?: React$Node,
  isError?: boolean,
  isHidden?: boolean,
  label?: React$Node,
  value?: mixed,
  withCopy?: boolean,
  withLabel?: boolean
};

export default function Output ({ className, children, isError = false, isHidden, label, style, value, withCopy = false, withLabel }: Props): React$Node {
  return (
    <Labelled
      className={className}
      isHidden={isHidden}
      label={label}
      style={style}
      withLabel={withLabel}
    >
      <div className={classes('ui--output', isError && 'error')}>
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
