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

type State = {
  chartData?: ChartJs.ChartData,
  chartOptions?: ChartJs.ChartOptions,
  valuesStr?: string
};

const alphaColor = (hexColor: string): string =>
  ChartJs.helpers.color(hexColor).alpha(0.65).rgbString();

export default class ChartHorizBar extends React.PureComponent<Props, State> {
  state: State = {};

  static getDerivedStateFromProps ({ aspectRatio = 4, values }: Props, prevState: State) {
    const valuesStr = JSON.stringify(values);

    if (valuesStr === prevState.valuesStr) {
      return null;
    }

    const chartData = values.reduce((data, { colors: [normalColor = '#00f', hoverColor], label, value }) => {
      const dataset = data.datasets[0];

      dataset.backgroundColor.push(alphaColor(normalColor));
      dataset.hoverBackgroundColor.push(alphaColor(hoverColor || normalColor));
      dataset.data.push(bnToBn(value).toNumber());
      data.labels.push(label);

      return data;
    }, {
      labels: [] as Array<string>,
      datasets: [{
        data: [] as Array<number>,
        backgroundColor: [] as Array<string>,
        hoverBackgroundColor: [] as Array<string>
      }]
    });

    return {
      chartData,
      chartOptions: {
        // width/height by default this is "1", i.e. a square box
        aspectRatio,
        // no need for the legend, expect the labels contain everything
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true,
              max: 100
            }
          }]
        }
      },
      valuesStr
    };
  }

  render () {
    const { className, style } = this.props;
    const { chartData, chartOptions } = this.state;

    if (!chartData) {
      return null;
    }

    return (
      <div
        className={className}
        style={style}
      >
        <HorizontalBar
          data={chartData}
          options={chartOptions}
        />
      </div>
    );
  }
}
