// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import BN from 'bn.js';
import React from 'react';
import SUIProgress from 'semantic-ui-react/dist/commonjs/modules/Progress/Progress';
import { UInt } from '@polkadot/types';
import { bnToBn, isBn, isUndefined } from '@polkadot/util';

import { classes } from './util';

type BaseColors = 'blue' | 'green' | 'red' | 'orange';
export type Colors = 'auto' | 'autoReverse' | BaseColors;

interface Props extends BareProps {
  color?: Colors;
  percent?: BN | number;
  total?: UInt | BN | number;
  value?: UInt | BN | number;
}

export default function Progress ({ className, color = 'blue', percent, total, style, value }: Props): React.ReactElement<Props> | null {
  let calculated: number | undefined;
  const _total = bnToBn(total);
  const _value = bnToBn(value);

  if (_total.gtn(0)) {
    calculated = 100.0 * _value.toNumber() / _total.toNumber();
  } else {
    calculated = isBn(percent) ? percent.toNumber() : percent;
  }

  if (isUndefined(calculated) || calculated < 0) {
    return null;
  }

  let rainbow: BaseColors;

  if (color === 'auto' || color === 'autoReverse') {
    if (calculated > 66.6) {
      rainbow = color === 'auto' ? 'green' : 'red';
    } else if (calculated > 33.3) {
      rainbow = 'orange';
    } else {
      rainbow = color === 'auto' ? 'red' : 'green';
    }
  } else {
    rainbow = color;
  }

  return (
    <SUIProgress
      className={classes('ui--Progress', className)}
      color={rainbow}
      percent={calculated}
      size='tiny'
      style={style}
    />
  );
}
