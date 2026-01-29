// Copyright 2017-2025 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CSSProperties } from 'react';

import React from 'react';

import { styled } from '@polkadot/react-components';

export interface Props {
  className?: string,
  style?: CSSProperties,
  progress: number
}

function Progress ({ className = '', progress, style }: Props) {
  return (
    <StyledDiv
      className={`${className} highlight--border`}
      style={style}
    >
      <div
        className='file-progress-bar highlight--bg'
        style={{ width: `${progress}%` }}
      />
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  width: 100%;
  background: unset;
  overflow: hidden;
  height: 1.4rem;
  border-radius: 0.7rem;
  border-style: solid;
  border-width: 1px;

  .file-progress-bar {
    transition: width 100ms ease-in-out;
    width: 0;
    height: 100%;
  }
`;

export default React.memo<Props>(Progress);
