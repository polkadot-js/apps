// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { HorizBarProps, HorizBarValue } from './types';

import React, { useEffect, useState } from 'react';
import ChartJs from 'chart.js';
import { HorizontalBar } from 'react-chartjs-2';
import { bnToBn, isNumber } from '@polkadot/util';

interface State {
  chartData?: ChartJs.ChartData;
  chartOptions?: ChartJs.ChartOptions;
  jsonValues?: string;
}

interface TooltipItem {
  index: number;
}

interface Config {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
  }[];
}

const alphaColor = (hexColor: string): string =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  ChartJs.helpers.color(hexColor).alpha(0.65).rgbString();

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
      // width/height by default this is "1", i.e. a square box
      aspectRatio,
      // no need for the legend, expect the labels contain everything
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          ticks: showLabels
            ? { beginAtZero: true, max }
            : { display: false }
        }]
      },
      tooltips: {
        callbacks: {
          label: (item: TooltipItem): string =>
            values[item.index].tooltip || values[item.index].label
        }
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
      <HorizontalBar
        data={chartData}
        height={null as unknown as number}
        options={chartOptions}
        width={null as unknown as number}
      />
    </div>
  );
}

export default React.memo(ChartHorizBar);
