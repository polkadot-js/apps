// Copyright 2017-2023 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { CSSProperties } from 'react';
import styled from 'styled-components';

export interface Props {
  className?: string,
  style?: CSSProperties,
  progress: number
}

function Progress ({ className = '', progress, style }: Props) {
  return (
    <div
      className={`highlight--border ${className}`}
      style={style}
    >
      <div
        className='file-progress-bar highlight--bg'
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default React.memo<Props>(styled(Progress)`
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
`);
