// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '../types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import ChartJs from 'chart.js';
import { Line } from 'react-chartjs-2';
import { bnToBn } from '@polkadot/util';

interface Value {
  label: string;
  value: number | BN;
}

interface Props extends BareProps {
  aspectRatio?: number;
  values: Value[];
}

interface State {
  chartData?: ChartJs.ChartData;
  chartOptions?: ChartJs.ChartOptions;
  jsonValues?: string;
}

interface Config {
  labels: string[];
  datasets: {
    data: number[];
    fill: boolean;
    backgroundColor: string;
    borderColor: string;
    hoverBackgroundColor: string;
  }[];
}

const alphaColor = (hexColor: string): string =>
  ChartJs.helpers.color(hexColor).alpha(0.65).rgbString();

function calculateOptions (aspectRatio: number, values: Value[], jsonValues: string): State {
  const chartData = values.reduce((data, { label, value }): Config => {
    const dataset = data.datasets[0];

    dataset.data.push(bnToBn(value).toNumber());
    data.labels.push(label);

    return data;
  }, {
    labels: [] as string[],
    datasets: [{
      data: [] as number[],
      fill: false,
      backgroundColor: alphaColor('#ff8c00'),
      borderColor: alphaColor('#ff8c00'),
      hoverBackgroundColor: alphaColor('#ff8c00')
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
            beginAtZero: true
          }
        }]
      }
    },
    jsonValues
  };
}

export default function LineChart ({ aspectRatio = 4, className, style, values }: Props): React.ReactElement<Props> | null {
  const [{ chartData, chartOptions, jsonValues }, setState] = useState<State>({});

  useEffect((): void => {
    const newJsonValues = JSON.stringify(values);

    if (newJsonValues !== jsonValues) {
      setState(calculateOptions(aspectRatio, values, newJsonValues));
    }
  }, [values]);

  if (!chartData) {
    return null;
  }

  return (
    <div
      className={className}
      style={style}
    >
      <Line
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
}
