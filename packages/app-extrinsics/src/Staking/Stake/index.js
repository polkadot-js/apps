// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '../../types';

import React from 'react';

import getValues from './getValues';

type Props = BaseProps & {};

function StakingStake ({ className, style }: Props) {
  return (
    <div
      className={['extrinsics--StakingStake', className].join(' ')}
      style={style}
    />
  );
}

StakingStake.getValues = getValues;

export default StakingStake;
