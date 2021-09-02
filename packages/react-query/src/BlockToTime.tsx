// Copyright 2017-2021 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { ApiPromise } from '@polkadot/api';

import React from 'react';
import styled from 'styled-components';

import { useBlockTime } from '@polkadot/react-hooks';

interface Props {
  api?: ApiPromise;
  children?: React.ReactNode;
  className?: string;
  isInline?: boolean;
  label?: React.ReactNode;
  value?: BN;
}

function BlockToTime ({ api, children, className = '', isInline, label, value }: Props): React.ReactElement<Props> | null {
  const [, text] = useBlockTime(value, api);

  if (!value || value.isZero()) {
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
    font-size: 0.825em;
  }
`);
