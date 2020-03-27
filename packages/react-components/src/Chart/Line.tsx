// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LineProps } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import ChartJs from 'chart.js';
import { Line } from 'react-chartjs-2';

interface State {
  chartData?: ChartJs.ChartData;
  chartOptions?: ChartJs.ChartOptions;
  jsonValues?: string;
}

interface Dataset {
  data: number[];
  fill: boolean;
  label: string;
  backgroundColor: string;
  borderColor: string;
  hoverBackgroundColor: string;
}

interface Config {
  labels: string[];
  datasets: Dataset[];
}

const COLORS = ['#ff8c00', '#008c8c', '#8c008c'];

const alphaColor = (hexColor: string): string =>
  ChartJs.helpers.color(hexColor).alpha(0.65).rgbString();

function calculateOptions (colors: (string | undefined)[] = [], legends: string[], labels: string[], values: (number | BN)[][], jsonValues: string): State {
  const chartData = values.reduce((chartData, values, index): Config => {
    const color = colors[index] || alphaColor(COLORS[index]);
    const data = values.map((value): number => BN.isBN(value) ? value.toNumber() : value);

    chartData.datasets.push({
      data,
      fill: false,
      label: legends[index],
      backgroundColor: color,
      borderColor: color,
      hoverBackgroundColor: color
    });

    return chartData;
  }, {
    labels,
    datasets: [] as Dataset[]
  });

  return {
    chartData,
    chartOptions: {
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

function LineChart ({ className, colors, labels, legends, style, values }: LineProps): React.ReactElement<LineProps> | null {
  const [{ chartData, chartOptions, jsonValues }, setState] = useState<State>({});

  useEffect((): void => {
    const newJsonValues = JSON.stringify(values);

    if (newJsonValues !== jsonValues) {
      setState(calculateOptions(colors, legends, labels, values, newJsonValues));
    }
  }, [colors, jsonValues, labels, legends, values]);

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

export default React.memo(LineChart);
