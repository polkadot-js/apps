// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { styled } from '@polkadot/react-components';

interface PieChartProps {
  data: { label: string; value: number; color: string }[];
}

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const GraphContainer = styled.div`
  position: relative;
`;

const LegendContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ColorBox = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  background-color: ${(props: { color: string }) => props.color};
  margin-right: 10px;
`;

function UsageBar ({ data }: PieChartProps): React.ReactElement<PieChartProps> {
  const radius = 50;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;

  const total = data.reduce((acc, item) => acc + item.value, 0);

  let cumulativeOffset = 0;

  if (!total) {
    return <></>;
  }

  return (
    <Container>
      <GraphContainer>
        <svg
          height={radius * 2}
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          width={radius * 2}
        >
          <circle
            cx={radius}
            cy={radius}
            fill='none'
            r={radius - strokeWidth / 2}
            stroke='#f0f0f0'
            strokeWidth={strokeWidth}
          />
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const dashArray = (percentage / 100) * circumference;
            const dashOffset = (cumulativeOffset / 100) * circumference;

            cumulativeOffset += percentage;

            return (
              <circle
                cx={radius}
                cy={radius}
                fill='none'
                key={index}
                r={radius - strokeWidth / 2}
                stroke={item.color}
                strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                strokeDashoffset={-dashOffset}
                strokeWidth={strokeWidth}
                transform={`rotate(-90 ${radius} ${radius})`}
              >
                <title>{`${item.label}: ${percentage.toFixed(2)}%`}</title>
              </circle>
            );
          })}
        </svg>
      </GraphContainer>
      <LegendContainer>
        {data.map((item, index) => (
          <LegendItem key={index}>
            <ColorBox color={item.color} />
            <span>{`${item.label}: ${((item.value / total) * 100).toFixed(2)}%`}</span>
          </LegendItem>
        ))}
      </LegendContainer>
    </Container>
  );
}

export default React.memo(UsageBar);
