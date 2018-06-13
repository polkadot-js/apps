// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from './types';

import React from 'react';

import Labelled from './Labelled';

type Props = BareProps & {
  children?: React$Node,
  isHidden?: boolean,
  label?: React$Node,
  value?: React$Node,
  withLabel?: boolean
};

export default function Static ({ className, children, isHidden, label, style, value, withLabel }: Props): React$Node {
  return (
    <Labelled
      className={className}
      isHidden={isHidden}
      label={label}
      style={style}
      withLabel={withLabel}
    >
      <div className='ui dropdown selection disabled'>
        {value}
        {children}
      </div>
    </Labelled>
  );
}
