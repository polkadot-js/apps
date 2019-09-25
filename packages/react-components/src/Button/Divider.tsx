// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DividerProps } from './types';

import React from 'react';

import { classes } from '../util';

export default function ButtonDivider ({ className, style }: DividerProps): React.ReactElement<DividerProps> {
  return (
    <div
      className={classes('ui button compact mini basic', className)}
      style={style}
    />
  );
}
