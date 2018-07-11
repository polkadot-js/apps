// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';

import CopyButton from './CopyButton';
import Labelled from './Labelled';
import classes from './util/classes';

type Props = BareProps & {
  children?: React.ReactNode,
  isError?: boolean,
  isHidden?: boolean,
  label?: any, // node?
  value?: any,
  withCopy?: boolean,
  withLabel?: boolean
};

export default function Output ({ className, children, isError = false, isHidden, label, style, value, withCopy = false, withLabel }: Props) {
  return (
    <Labelled
      className={className}
      isHidden={isHidden}
      label={label}
      style={style}
      withLabel={withLabel}
    >
      <div className={classes('ui--output', isError && 'error')}>
        {value}
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
