// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '../types';

import BN from 'bn.js';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { bnToBn } from '@polkadot/util';

import classes from '../util/classes';

type Value = {
  colors: Array<string>,
  label: string,
  value: number | BN
};

type Props = BareProps & {
  size?: number,
  values: Array<Value>
};

type Options = {
  colorNormal: Array<string>,
  colorHover: Array<string>,
  data: Array<number>,
  labels: Array<string>
};

export default class ChartDoughnut extends React.PureComponent<Props> {
  render () {
    const { className, size = 100, style, values } = this.props;

    const options = values.reduce((options, { colors: [normalColor = '#00f', hoverColor], label, value }) => {
      options.colorNormal.push(normalColor);
      options.colorHover.push(hoverColor || normalColor);
      options.data.push(bnToBn(value).toNumber());
      options.labels.push(label);

      return options;
    }, {
      colorNormal: [],
      colorHover: [],
      data: [],
      labels: []
    } as Options);

    return (
      <div
        className={classes('ui--Chart', className)}
        style={style}
      >
        <Doughnut
          data={{
            labels: options.labels,
            datasets: [{
              data: options.data,
              backgroundColor: options.colorNormal,
              hoverBackgroundColor: options.colorHover
            }]
          }}
          height={size}
          width={size}
        />
      </div>
    );
  }
}
