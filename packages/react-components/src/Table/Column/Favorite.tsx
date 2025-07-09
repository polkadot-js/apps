// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';

import Icon from '../../Icon.js';
import { styled } from '../../styled.js';

export interface Props {
  address: string;
  className?: string;
  colSpan?: number;
  isFavorite: boolean;
  rowSpan?: number;
  toggle: (address: string) => void;
}

function Favorite ({ address, className = '', colSpan, isFavorite, rowSpan, toggle }: Props): React.ReactElement<Props> {
  const onClick = useCallback(
    () => toggle(address),
    [address, toggle]
  );

  return (
    <StyledTd
      className={`${className} ui--Table-Column-Favorite`}
      colSpan={colSpan}
      onClick={onClick}
      rowSpan={rowSpan}
    >
      <Icon
        color={
          isFavorite
            ? 'orange'
            : 'gray'
        }
        icon='star'
      />
    </StyledTd>
  );
}

const StyledTd = styled.td`
  && {
    box-sizing: content-box;
    cursor: pointer;
    min-width: 1rem;
    padding-right: 0.35rem;
    text-align: right;
    width: 1rem;
  }
`;

export default React.memo(Favorite);
