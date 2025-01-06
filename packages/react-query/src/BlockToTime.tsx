// Copyright 2017-2025 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { BN } from '@polkadot/util';

import React from 'react';

import { styled } from '@polkadot/react-components/styled';
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
    <StyledDiv className={`${className} ui--BlockToTime ${isInline ? 'isInline' : ''}`}>
      {label || ''}{text.split(' ').map((v, index) =>
        <span
          className={index % 2 ? 'timeUnits' : undefined}
          key={index}
        >{v}</span>
      )}{children}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  &.isInline {
    display: inline-block;
  }

  span+span {
    padding-left: 0.25em;
  }

  span.timeUnits {
    font-size: var(--font-percent-tiny);
  }
`;

export default React.memo(BlockToTime);
