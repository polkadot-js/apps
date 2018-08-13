// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from './types';

import BN from 'bn.js';
import React from 'react';
import SUIProgress from 'semantic-ui-react/dist/commonjs/modules/Progress/Progress';
import isBn from '@polkadot/util/is/bn';
import isUndefined from '@polkadot/util/is/undefined';

import classes from './util/classes';

type BaseColors = 'blue' | 'green' | 'red' | 'orange';
export type Colors = 'auto' | 'autoReverse' | BaseColors;

type Props = BareProps & {
  color?: Colors,
  percent?: BN | number,
  total?: BN | number,
  value?: BN | number
};

export default class Progress extends React.PureComponent<Props> {
  render () {
    const { className, color = 'blue', percent, total, style, value } = this.props;
    let calculated: number | undefined;

    if (!isUndefined(value) && !isUndefined(total) && (isBn(total) ? total.gtn(0) : total > 0)) {
      calculated = 100.0 * (isBn(value) ? value.toNumber() : value) / (isBn(total) ? total.toNumber() : total);
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
}
