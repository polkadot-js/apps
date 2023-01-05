// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChartData, ChartOptions, TooltipItem } from 'chart.js';
import type { HorizBarProps, HorizBarValue } from './types';

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import { bnToBn, isNumber } from '@polkadot/util';

import { alphaColor } from './utils';

interface State {
  chartData?: ChartData;
  chartOptions?: ChartOptions;
  jsonValues?: string;
}

interface Config {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
  }[];
}

function calculateOptions (aspectRatio: number, values: HorizBarValue[], jsonValues: string, max: number, showLabels: boolean): State {
  const chartData = values.reduce((data, { colors: [normalColor = '#00f', hoverColor], label, value }): Config => {
    const dataset = data.datasets[0];

    dataset.backgroundColor.push(alphaColor(normalColor));
    dataset.hoverBackgroundColor.push(alphaColor(hoverColor || normalColor));
    dataset.data.push(isNumber(value) ? value : bnToBn(value).toNumber());
    data.labels.push(label);

    return data;
  }, {
    datasets: [{
      backgroundColor: [] as string[],
      data: [] as number[],
      hoverBackgroundColor: [] as string[]
    }],
    labels: [] as string[]
  });

  return {
    chartData,
    chartOptions: {
      aspectRatio,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (item: TooltipItem<any>): string =>
              values[item.dataIndex].tooltip || values[item.dataIndex].label
          }
        }
      },
      scales: {
        x: showLabels
          ? { beginAtZero: true, max }
          : { display: false }
      }
    },
    jsonValues
  };
}

function ChartHorizBar ({ aspectRatio = 8, className = '', max = 100, showLabels = false, values }: HorizBarProps): React.ReactElement<HorizBarProps> | null {
  const [{ chartData, chartOptions, jsonValues }, setState] = useState<State>({});

  useEffect((): void => {
    const newJsonValues = JSON.stringify(values);

    if (newJsonValues !== jsonValues) {
      setState(calculateOptions(aspectRatio, values, newJsonValues, max, showLabels));
    }
  }, [aspectRatio, jsonValues, max, showLabels, values]);

  if (!chartData) {
    return null;
  }

  // HACK on width/height to get the aspectRatio to work
  return (
    <div className={className}>
      <Bar
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data={chartData as any}
        height={null as unknown as number}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        options={chartOptions as any}
        width={null as unknown as number}
      />
    </div>
  );
}

export default React.memo(ChartHorizBar);
