// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '../../types';

import React from 'react';

import classes from '../../util/classes';

type Props = BareProps & {
  children: React$Node
};

export default function Bare ({ children, className, style }: Props): React$Node {
  return (
    <div
      className={classes('ui--row', className)}
      style={style}
    >
      {children}
    </div>
  );
}
