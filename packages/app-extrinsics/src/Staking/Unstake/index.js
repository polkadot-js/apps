// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '../../types';

import React from 'react';
import { translate } from 'react-i18next';

import getValues from './getValues';

type Props = BaseProps & {};

function StakingUnstake ({ className, style }: Props): React$Node {
  return (
    <div
      className={['extrinsics--StakingUnstake', className].join(' ')}
      style={style}
    />
  );
}

StakingUnstake.getValues = getValues;

export default translate(['extrinsics'])(StakingUnstake);
