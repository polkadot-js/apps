// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '../types';

import BN from 'bn.js';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { bnToBn } from '@polkadot/util';

import Base from './Base';

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

    // FIXME Classic case of kicking the can down the road, i.e. don't expend energy
    // when stuff are not used. This was replaced by the HorizBar as the only Chart
    // in actual use (by Referendum). However the below is not optimal, and gets re-
    // calculated on each render. If this component is put back in use, look at
    // getDerivedStateFromProps in HorizBar (the logic is the same for chartData)
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
      <Base
        className={className}
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
      </Base>
    );
  }
}
