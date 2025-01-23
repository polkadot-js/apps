// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChartData, ChartOptions, TooltipItem } from 'chart.js';
import type { BN } from '@polkadot/util';

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import { bnToBn, isNumber } from '@polkadot/util';

import { alphaColor } from './utils.js';

interface Value {
  colors: string[];
  label: string;
  tooltip?: string;
  value: number | BN;
}

export interface Props {
  aspectRatio?: number;
  className?: string;
  max?: number;
  showLabels?: boolean;
  values: Value[];
  withColors?: boolean;
}

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

function calculateOptions (aspectRatio: number, values: Value[], jsonValues: string, max: number, showLabels: boolean): State {
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

function ChartHorizBar ({ aspectRatio = 8, className = '', max = 100, showLabels = false, values }: Props): React.ReactElement<Props> | null {
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
    <div className={`${className} ui--Chart-HorizBar`}>
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
