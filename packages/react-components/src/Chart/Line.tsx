// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChartData, ChartOptions } from 'chart.js';
import type { BN } from '@polkadot/util';
import type { LineProps } from './types';

import React, { useMemo } from 'react';
import * as Chart from 'react-chartjs-2';

import { isBn, objectSpread } from '@polkadot/util';

import ErrorBoundary from '../ErrorBoundary';
import { alphaColor } from './utils';

interface Dataset {
  data: number[];
  fill: boolean;
  label: string;
  lineTension: number;
  backgroundColor: string;
  borderColor: string;
  cubicInterpolationMode: 'default' | 'linear';
  hoverBackgroundColor: string;
}

interface Config {
  labels: string[];
  datasets: Dataset[];
}

const COLORS = ['#ff8c00', '#008c8c', '#8c008c'];

const BASE_OPTS: ChartOptions = {
  animation: {
    duration: 0
  },
  elements: {
    point: {
      hoverRadius: 6,
      radius: 0
    }
  },
  hover: {
    intersect: false
  },
  interaction: {
    intersect: false,
    mode: 'index'
  },
  plugins: {
    crosshair: {
      line: {
        color: '#ff8c00',
        dashPattern: [5, 5],
        width: 2
      },
      snap: {
        enabled: true
      },
      sync: {
        enabled: true
      },
      // this would be nice, but atm just doesn't quite
      // seem or feel intuitive...
      zoom: {
        enabled: false
      }
    },
    legend: {
      display: false
    },
    tooltip: {
      intersect: false
    }
  },
  scales: {
    x: {
      beginAtZero: true
    }
  }
};

function getOptions (options: ChartOptions = {}): ChartOptions {
  return objectSpread({}, BASE_OPTS, options, {
    // Re-spread plugins for deep(er) copy
    plugins: objectSpread({}, BASE_OPTS.plugins, options.plugins, {
      // Same applied to plugins, we may want specific values
      annotation: objectSpread({}, BASE_OPTS.plugins?.annotation, options.plugins?.annotation),
      crosshair: objectSpread({}, BASE_OPTS.plugins?.crosshair, options.plugins?.crosshair),
      tooltip: objectSpread({}, BASE_OPTS.plugins?.tooltip, options.plugins?.tooltip)
    })
  });
}

function getData (colors: (string | undefined)[] = [], legends: string[], labels: string[], values: (number | BN)[][]): ChartData {
  return values.reduce((chartData, values, index): Config => {
    const color = colors[index] || alphaColor(COLORS[index]);
    const data = values.map((value): number => isBn(value) ? value.toNumber() : value);

    chartData.datasets.push({
      backgroundColor: color,
      borderColor: color,
      cubicInterpolationMode: 'default',
      data,
      fill: false,
      hoverBackgroundColor: color,
      label: legends[index],
      lineTension: 0.25
    });

    return chartData;
  }, { datasets: [] as Dataset[], labels });
}

function LineChart ({ className, colors, labels, legends, options, values }: LineProps): React.ReactElement<LineProps> | null {
  const chartOptions = useMemo(
    () => getOptions(options),
    [options]
  );

  const chartData = useMemo(
    () => getData(colors, legends, labels, values),
    [colors, labels, legends, values]
  );

  return (
    <div className={className}>
      <ErrorBoundary>
        <Chart.Line
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data={chartData as any}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          options={chartOptions as any}
        />
      </ErrorBoundary>
    </div>
  );
}

export default React.memo(LineChart);
