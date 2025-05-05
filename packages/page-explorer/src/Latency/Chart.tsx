// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChartOptions } from 'chart.js';
import type { ChartContents } from './types.js';

import React from 'react';

import { Chart, styled } from '@polkadot/react-components';

interface Props {
  className?: string;
  colors: string[];
  legends: string[];
  options?: ChartOptions;
  title: string;
  value: ChartContents;
}

const OPTIONS: ChartOptions = {
  aspectRatio: 6,
  maintainAspectRatio: true
};

function ChartDisplay ({ className, colors, legends, options, title, value: { labels, values } }: Props): React.ReactElement<Props> {
  return (
    <StyledDiv className={className}>
      <Chart.Line
        colors={colors}
        labels={labels}
        legends={legends}
        options={options || OPTIONS}
        title={title}
        values={values}
      />
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  background: var(--bg-table);
  border: 1px solid var(--border-table);
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  padding: 1rem 1.5rem;
`;

export default React.memo(ChartDisplay);
