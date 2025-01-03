// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ProgressBarSection } from './types.js';

import React from 'react';

import { styled } from './styled.js';

interface Props {
  sections: ProgressBarSection[];
}

function ProgressBar ({ sections }: Props): React.ReactElement<Props> | null {
  const overallTotal = sections?.reduce((sum, section) => sum + section.total, 0);

  return (
    <StyledDiv>
      <div className='progress-container'>
        {sections?.map((section, index) => {
          const sectionWidth = (section.total / overallTotal) * 100;
          const sectionProgress = (section.value / section.total) * 100;

          return (
            <div
              className='progress-segment'
              key={index}
              style={{ width: `${sectionWidth}%` }}
            >
              <div
                className='progress-bar'
                style={{ width: `${sectionProgress}%` }}
              />
              <div className='marker' />
            </div>
          );
        })}
      </div>
      <div className='labels'>
        {sections.map((section, index) => (
          <div
            className='label'
            key={index}
            style={{ width: `${100 / sections.length}%` }}
          >
            {section.label}
          </div>
        ))}
      </div>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  width: 100%;
  .progress-container {
    display: flex;
    height: 1rem;
    background-color: #e0e0e0;
    border-radius: 0.5rem;
    overflow: hidden;
    position: relative;
  }

  .progress-segment {
    position: relative;
    background-color: transparent;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .progress-bar {
    background-color: #007bff;
    height: 100%;
    transition: width 0.3s ease;
  }

  .marker {
    position: absolute;
    left: 0;
    top: -0.5rem;
    width: 2px;
    height: 1.5rem;
    background-color: #000000;
  }

  .labels {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
  }

  .label {
    text-align: center;
    font-size: 0.875rem;
  }
`;

export default React.memo(ProgressBar);
