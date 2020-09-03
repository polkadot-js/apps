// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { useBlockTime } from '@polkadot/react-hooks';

interface Props {
  blocks?: BN;
  children?: React.ReactNode;
  className?: string;
  isInline?: boolean;
  label?: React.ReactNode;
}

function BlockToTime ({ blocks, children, className = '', isInline, label }: Props): React.ReactElement<Props> | null {
  const [, text] = useBlockTime(blocks);

  if (blocks?.ltn(0)) {
    return null;
  }

  return (
    <div className={`${className}${isInline ? ' isInline' : ''}`}>
      {label || ''}{text.split(' ').map((v, index) =>
        <span
          className={index % 2 ? 'timeUnits' : undefined}
          key={index}
        >{v}</span>
      )}{children}
    </div>
  );
}

export default React.memo(styled(BlockToTime)`
  &.isInline {
    display: inline-block;
  }

  span+span {
    padding-left: 0.25em;
  }

  span.timeUnits {
    font-size: 0.85em;
  }
`);
