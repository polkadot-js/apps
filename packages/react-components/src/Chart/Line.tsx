// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChartData, ChartDataset, ChartOptions, DatasetChartOptions } from 'chart.js';
import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';
import * as Chart from 'react-chartjs-2';

import { isBn, objectSpread } from '@polkadot/util';

import ErrorBoundary from '../ErrorBoundary.js';
import { styled } from '../styled.js';
import { alphaColor } from './utils.js';

export interface Props {
  colors?: (string | undefined)[];
  className?: string;
  labels: string[];
  legends: string[];
  options?: ChartOptions;
  values: (number | BN)[][];
  title?: React.ReactNode;
}

interface Config {
  labels: string[];
  datasets: ChartDataset<'line'>[];
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
      ticks: {
        maxRotation: 60,
        minRotation: 60
      }
    }
  }
};

function getOptions (options: ChartOptions = {}): DatasetChartOptions<'line'> {
  return objectSpread({}, BASE_OPTS, options, {
    // Re-spread plugins for deep(er) copy
    plugins: objectSpread({}, BASE_OPTS.plugins, options.plugins, {
      // Same applied to plugins, we may want specific values
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      annotation: objectSpread({}, BASE_OPTS.plugins?.annotation, options.plugins?.annotation),
      crosshair: objectSpread({}, BASE_OPTS.plugins?.crosshair, options.plugins?.crosshair),
      tooltip: objectSpread({}, BASE_OPTS.plugins?.tooltip, options.plugins?.tooltip)
    }),
    scales: objectSpread({}, BASE_OPTS.scales, options.scales, {
      x: objectSpread({}, BASE_OPTS.scales?.x, options.scales?.x),
      y: objectSpread({}, BASE_OPTS.scales?.y, options.scales?.y)
    })
  });
}

function getData (colors: (string | undefined)[] = [], legends: string[], labels: string[], values: (number | BN)[][]): ChartData<'line'> {
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
      // @ts-expect-error The typings here doesn't reflect this one
      lineTension: 0.25
    });

    return chartData;
  }, { datasets: [] as ChartDataset<'line'>[], labels });
}

function LineChart ({ className = '', colors, labels, legends, options, title, values }: Props): React.ReactElement<Props> | null {
  const chartOptions = useMemo(
    () => getOptions(options),
    [options]
  );

  const chartData = useMemo(
    () => getData(colors, legends, labels, values),
    [colors, labels, legends, values]
  );

  return (
    <StyledDiv className={`${className} ui--Chart-Line`}>
      {title && <h1 className='ui--Chart-Header'>{title}</h1>}
      <ErrorBoundary>
        <Chart.Line
          data={chartData}
          options={chartOptions}
        />
      </ErrorBoundary>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  h1.ui--Chart-Header {
    margin-bottom: 0.25rem;
    margin-top: 1rem;
    padding-left: 0.25rem;
  }
`;

export default React.memo(LineChart);
