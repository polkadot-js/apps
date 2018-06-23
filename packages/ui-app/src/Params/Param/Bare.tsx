// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '../../types';

import React from 'react';

import classes from '../../util/classes';

type Props = BareProps & {
  children: any // node?
};

export default function Bare ({ children, className, style }: Props) {
  return (
    <div
      className={classes('ui--row', className)}
      style={style}
    >
      {children}
    </div>
  );
}
