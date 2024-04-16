// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { styled } from './styled.js';

const BarContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 4px;
  overflow: hidden;
`;

interface SectionProps {
  value: string;
}

const Segment = styled.div<SectionProps>`
  flex: 1;
  width: 5px;
  height: 20px;
  margin-right: 2px;
  opacity: ${(props) => {
    return props.value;
  }};
  width: 100%;
  background-color: ${(props) => props.value === '1' ? 'var(--bg-inverse)' : 'white'};
`;

function MaskCoverage ({ values }: { values: string[] }) {
  return (
    <BarContainer className='highlight--bg'>
      {values.map((value, index) => (
        <Segment
          key={index}
          value={value === '1' ? '0' : '1'}
        />
      ))}
    </BarContainer>
  );
}

export default React.memo(MaskCoverage);
