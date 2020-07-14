// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

interface Props {
  color: string;
  className?: string;
}

function ChainColorIndicator ({ className = '', color }: Props): React.ReactElement<Props> {
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
