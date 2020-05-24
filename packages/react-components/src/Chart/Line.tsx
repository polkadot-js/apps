// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LineProps } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import ChartJs from 'chart.js';
import * as Chart from 'react-chartjs-2';

interface State {
  chartData?: ChartJs.ChartData;
  chartOptions?: ChartJs.ChartOptions;
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

// Ok, this does exists, but the export if not there in the typings - so it works,
//  but we have to jiggle around here to get it to actually compile :(
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
(Chart as any).Chart.pluginService.register({
  beforeDraw: ({ chart: { ctx }, chartArea }: { chart: { ctx: { fillStyle: string; fillRect: (left: number, top: number, width: number, height: number) => void; restore: () => void; save: () => void } }; chartArea: { bottom: number; left: number; right: number; top: number } }) => {
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
    ctx.restore();
  }
});

const COLORS = ['#ff8c00', '#008c8c', '#8c008c'];

const alphaColor = (hexColor: string): string =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  ChartJs.helpers.color(hexColor).alpha(0.65).rgbString();

const chartOptions = {
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
};

function calculateOptions (colors: (string | undefined)[] = [], legends: string[], labels: string[], values: (number | BN)[][]): State {
  const chartData = values.reduce((chartData, values, index): Config => {
    const color = colors[index] || alphaColor(COLORS[index]);
    const data = values.map((value): number => BN.isBN(value) ? value.toNumber() : value);

    chartData.datasets.push({
      backgroundColor: color,
      borderColor: color,
      data,
      fill: false,
      hoverBackgroundColor: color,
      label: legends[index]
    });

    return chartData;
  }, { datasets: [] as Dataset[], labels });

  return {
    chartData,
    chartOptions
  };
}

function LineChart ({ className = '', colors, labels, legends, values }: LineProps): React.ReactElement<LineProps> | null {
  const [{ chartData, chartOptions }, setState] = useState<State>({});

  useEffect((): void => {
    setState(calculateOptions(colors, legends, labels, values));
  }, [colors, labels, legends, values]);

  if (!chartData) {
    return null;
  }

  return (
    <div className={className}>
      <Chart.Line
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
}

export default React.memo(LineChart);
