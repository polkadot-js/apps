// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LineData } from './types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Chart, Spinner } from '@polkadot/react-components';

interface Props {
  className?: string;
  colors: (string | undefined)[];
  header: string;
  labels: string[];
  legends: string[];
  values: LineData;
}

function ChartDisplay ({ className = '', colors, header, labels, legends, values }: Props): React.ReactElement<Props> {
  const isLoading = useMemo(
    () => labels.length === 0,
    [labels]
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
