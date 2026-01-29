// Copyright 2017-2025 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { styled } from '@polkadot/react-components';

interface Props {
  color?: string;
  className?: string;
}

function ChainColorIndicator ({ className, color }: Props): React.ReactElement<Props> {
  return (
    <StyledDiv
      className={className}
      color={color}
    />
  );
}

const StyledDiv = styled.div(({ color }: Props): string => `
  background-color: ${color || 'white'} !important;
  width: 100px;
  flex: 1;
  border-radius: 4px;
`);

export default React.memo(ChainColorIndicator);
