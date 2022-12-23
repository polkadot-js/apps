// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChartInfo } from './types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Chart, Spinner } from '@polkadot/react-components';

interface Props {
  chart: ChartInfo;
  className?: string;
  colors: (string | undefined)[];
  header: string;
  legends: string[];
}

function ChartDisplay ({ chart: { labels, values }, className = '', colors, header, legends }: Props): React.ReactElement<Props> {
  const isLoading = useMemo(
    () => labels.length === 0 || values.length === 0 || !values[0] || values[0].length !== labels.length,
    [labels, values]
  );

  return (
    <div className={`staking--Chart ${className}${isLoading ? ' isLoading' : ''}`}>
      <h1>{header}</h1>
      <Chart.Line
        colors={colors}
        labels={labels}
        legends={legends}
        values={values}
      />
      {isLoading && <Spinner />}
    </div>
  );
}

export default React.memo(styled(ChartDisplay)`
  position: relative;

  &.isLoading {
    canvas, h1 {
      opacity: 0.5;
    }

    .ui--Spinner {
      position: absolute;
      top: 34%;
      left: 0;
      right: 0;
    }
  }
`);
