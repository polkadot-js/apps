/* eslint-disable @typescript-eslint/no-unused-vars */
// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '../types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import ChartJs from 'chart.js';
import { HorizontalBar } from 'react-chartjs-2';
import { bnToBn, isNumber } from '@polkadot/util';

interface Value {
  colors: string[];
  label: string;
  tooltip?: string;
  value: number | BN;
}

interface Props extends BareProps {
  aspectRatio?: number;
  max?: number;
  showLabels?: boolean;
  values: Value[];
  withColors?: boolean;
}

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
  ChartJs.helpers.color(hexColor).alpha(0.65).rgbString();

function calculateOptions (aspectRatio: number, values: Value[], jsonValues: string, max: number, showLabels: boolean): State {
  const chartData = values.reduce((data, { colors: [normalColor = '#00f', hoverColor], label, value }): Config => {
    const dataset = data.datasets[0];

    dataset.backgroundColor.push(alphaColor(normalColor));
    dataset.hoverBackgroundColor.push(alphaColor(hoverColor || normalColor));
    dataset.data.push(isNumber(value) ? value : bnToBn(value).toNumber());
    data.labels.push(label);

    return data;
  }, {
    labels: [] as string[],
    datasets: [{
      data: [] as number[],
      backgroundColor: [] as string[],
      hoverBackgroundColor: [] as string[]
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
          ticks: showLabels
            ? { beginAtZero: true, max }
            : { display: false }
        }]
      },
      tooltips: {
        callbacks: {
          label: (item: TooltipItem, _: any): string =>
            values[item.index].tooltip || values[item.index].label
        }
      }
    },
    jsonValues
  };
}

export default function ChartHorizBar ({ aspectRatio = 8, className, max = 100, showLabels = false, style, values }: Props): React.ReactElement<Props> | null {
  const [{ chartData, chartOptions, jsonValues }, setState] = useState<State>({});

  useEffect((): void => {
    const newJsonValues = JSON.stringify(values);

    if (newJsonValues !== jsonValues) {
      setState(calculateOptions(aspectRatio, values, newJsonValues, max, showLabels));
    }
  }, [values]);

  if (!chartData) {
    return null;
  }

  // HACK on width/height to get the aspectRatio to work
  return (
    <div
      className={className}
      style={style}
    >
      <HorizontalBar
        data={chartData}
        height={null as any}
        options={chartOptions}
        width={null as any}
      />
    </div>
  );
}
