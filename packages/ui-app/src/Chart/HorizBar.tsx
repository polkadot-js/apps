// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '../types';

import BN from 'bn.js';
import React from 'react';
import ChartJs from 'chart.js';
import { HorizontalBar } from 'react-chartjs-2';
import { bnToBn } from '@polkadot/util';

type Value = {
  colors: Array<string>,
  label: string,
  value: number | BN
};

type Props = BareProps & {
  aspectRatio?: number,
  values: Array<Value>
};

type Options = {
  colorNormal: Array<string>,
  colorHover: Array<string>,
  data: Array<number>,
  labels: Array<string>
};

const alphaColor = (hexColor: string): string =>
  ChartJs.helpers.color(hexColor).alpha(0.65).rgbString();

export default class ChartHorizBar extends React.PureComponent<Props> {
  render () {
    const { aspectRatio = 4, className, style, values } = this.props;

    const options = values.reduce((options, { colors: [normalColor = '#00f', hoverColor], label, value }) => {
      options.colorNormal.push(alphaColor(normalColor));
      options.colorHover.push(alphaColor(hoverColor || normalColor));
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
        className={className}
        style={style}
      >
        <HorizontalBar
          data={{
            labels: options.labels,
            datasets: [{
              data: options.data,
              backgroundColor: options.colorNormal,
              hoverBackgroundColor: options.colorHover
            }]
          }}
          options={{
            // width/height by default this is "1", i.e. a square box
            aspectRatio,
            // no need for the legend, expect the labels contain everything
            legend: {
              display: false
            }
          }}
        />
      </div>
    );
  }
}
