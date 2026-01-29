// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';

import { bnToBn } from '@polkadot/util';

import Base from './Base.js';

interface DoughnutValue {
  colors: string[];
  label: string;
  value: number | BN;
}

export interface Props {
  className?: string;
  size?: number;
  values: DoughnutValue[];
}

interface Options {
  colorNormal: string[];
  colorHover: string[];
  data: number[];
  labels: string[];
}

function ChartDoughnut ({ className = '', size = 100, values }: Props): React.ReactElement<Props> {
  const options: Options = {
    colorHover: [],
    colorNormal: [],
    data: [],
    labels: []
  };

  values.forEach(({ colors: [normalColor = '#00f', hoverColor], label, value }): void => {
    options.colorNormal.push(normalColor);
    options.colorHover.push(hoverColor || normalColor);
    options.data.push(bnToBn(value).toNumber());
    options.labels.push(label);
  });

  return (
    <Base className={`${className} ui--Chart-Doughnut`}>
      <Doughnut
        data={{
          datasets: [{
            backgroundColor: options.colorNormal,
            data: options.data,
            hoverBackgroundColor: options.colorHover
          }],
          labels: options.labels
        }}
        height={size}
        width={size}
      />
    </Base>
  );
}

export default React.memo(ChartDoughnut);
