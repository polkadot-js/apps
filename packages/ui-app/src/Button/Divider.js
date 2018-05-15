// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '../types';

import React from 'react';

import classes from '../util/classes';

type Props = BareProps;

function ButtonDivider ({ className, style }: Props): React$Node {
  return (
    <div
      className={classes('ui button compact mini basic', className)}
      style={style}
    />
  );
}

export default ButtonDivider;
