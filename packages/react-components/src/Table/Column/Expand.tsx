// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Icon from '../../Icon.js';
import { styled } from '../../styled.js';

export interface Props {
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  isExpanded: boolean;
  toggle: () => void;
}

function Expand ({ className = '', colSpan, isExpanded, rowSpan, toggle }: Props): React.ReactElement<Props> {
  return (
    <StyledTd
      className={`${className} ui--Table-Column-Expand`}
      colSpan={colSpan}
      onClick={toggle}
      rowSpan={rowSpan}
    >
      <div>
        <Icon
          icon={
            isExpanded
              ? 'caret-up'
              : 'caret-down'
          }
        />
      </div>
    </StyledTd>
  );
}

const StyledTd = styled.td`
  && {
    box-sizing: content-box;
    cursor: pointer;
    min-width: 1.7rem;
    padding-left: 0;
    text-align: left;
    width: 1.7rem;

    > div {
      align-items: center;
      border: 1px solid var(--border-table);
      border-radius: 4px;
      box-sizing: border-box;
      display: inline-flex;
      height: 1.7rem;
      justify-content: center;
      width: 1.7rem;
    }
  }
`;

export default React.memo(Expand);
