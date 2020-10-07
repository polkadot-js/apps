// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from './types';

import BN from 'bn.js';
import React from 'react';
import SUIProgress from 'semantic-ui-react/dist/commonjs/modules/Progress/Progress';
import { UInt } from '@polkadot/types';
import { bnToBn, isBn, isUndefined } from '@polkadot/util';

import { classes } from '@canvas-ui/react-util';

type BaseColors = 'blue' | 'green' | 'red' | 'orange';
export type Colors = 'auto' | 'autoReverse' | BaseColors;

interface Props extends BareProps {
  color?: Colors;
  percent?: BN | number;
  total?: UInt | BN | number;
  value?: UInt | BN | number;
}

function Progress ({ className = '', color = 'blue', percent, total, value }: Props): React.ReactElement<Props> | null {
  const _total = bnToBn(total);
  const _value = bnToBn(value);
  const calculated = _total.gtn(0)
    ? (100.0 * _value.toNumber() / _total.toNumber())
    : isBn(percent)
      ? percent.toNumber()
      : percent;

  if (isUndefined(calculated) || calculated < 0) {
    return null;
  }

  const rainbow = (color === 'auto' || color === 'autoReverse')
    ? (calculated > 66.6)
      ? color === 'auto'
        ? 'green'
        : 'red'
      : (calculated > 33.3)
        ? 'orange'
        : color === 'auto'
          ? 'red'
          : 'green'
    : color;

  return (
    <SUIProgress
      className={classes('ui--Progress', className)}
      color={rainbow}
      percent={calculated}
      size='tiny'
    />
  );
}

export default React.memo(Progress);
