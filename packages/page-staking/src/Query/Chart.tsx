// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LineData } from './types.js';

import React, { useMemo } from 'react';

import { Chart, Spinner, styled } from '@polkadot/react-components';

interface Props {
  className?: string;
  colors: (string | undefined)[];
  labels: string[];
  legends: string[];
  title: string;
  values: LineData;
}

function ChartDisplay ({ className = '', colors, labels, legends, title, values }: Props): React.ReactElement<Props> {
  const isLoading = useMemo(
    () => !labels || labels.length === 0 || !values || values.length === 0 || !values[0]?.length,
    [labels, values]
  );

  return (
    <StyledDiv className={`${className} staking--Chart ${isLoading ? 'isLoading' : ''}`}>
      <Chart.Line
        colors={colors}
        labels={labels}
        legends={legends}
        title={title}
        values={values}
      />
      {isLoading && (
        <Spinner />
      )}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  &.isLoading {
    position: relative;

    canvas, h1 {
      opacity: 0.25;
    }

    .ui--Spinner {
      position: absolute;
      top: 34%;
      left: 0;
      right: 0;
    }
  }
`;

export default React.memo(ChartDisplay);
