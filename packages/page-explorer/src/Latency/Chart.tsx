// Copyright 2017-2022 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChartContents } from './types';

import React from 'react';
import styled from 'styled-components';

import { Chart } from '@polkadot/react-components';

interface Props {
  className?: string;
  colors: string[];
  legends: string[];
  title: string;
  value: ChartContents;
}

const OPTIONS = {
  aspectRatio: 6,
  maintainAspectRatio: true
};

function ChartDisplay ({ className, colors, legends, title, value: { labels, values } }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <h1>{title}</h1>
      <Chart.Line
        colors={colors}
        labels={labels}
        legends={legends}
        options={OPTIONS}
        values={values}
      />
    </div>
  );
}

export default React.memo(styled(ChartDisplay)`
  background: var(--bg-table);
  border: 1px solid var(--border-table);
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  padding: 1rem 1.5rem;
`);
