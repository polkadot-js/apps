// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

interface Props {
  color: string;
  className?: string;
}

function ChainColorIndicator ({ className, color }: Props): React.ReactElement<Props> {
  return (
    <div
      className={className}
      color={color}
    />
  );
}

export default React.memo(styled(ChainColorIndicator)`
    background-color: ${(props: Props): string => props.color} !important;
    width: 100px;
    flex: 1;
    border-radius: 4px;
`);
