// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  value: string;
}

function Digits ({ className = '', value }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      {value.split(',').map((parts, index) => (
        <div
          className='group'
          key={index}
        >
          {index !== 0 ? ',' : ''}
          {parts.split('').map((d, index) => (
            <div
              className='digit'
              key={index}
            >{d}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default React.memo(styled(Digits)`
  display: inline-block;
  white-space: nowrap;

  .group {
    display: inline-block;

    .digit {
      display: inline-block;
      text-align: center;
      width: 1ch;
    }
  }
`);
