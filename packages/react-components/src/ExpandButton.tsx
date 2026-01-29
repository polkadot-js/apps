// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Icon from './Icon.js';
import { styled } from './styled.js';

interface Props {
  onClick: () => void;
  expanded: boolean;
  className?: string;
}

function ExpandButton ({ className = '', expanded, onClick }: Props): React.ReactElement<Props> {
  return (
    <StyledDiv
      className={`${className} ui--ExpandButton`}
      data-testid='row-toggle'
      onClick={onClick}
    >
      <Icon icon={expanded ? 'caret-up' : 'caret-down'} />
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.7rem;
  height: 1.7rem;
  border: 1px solid var(--border-table);
  border-radius: 4px;
  cursor: pointer;
`;

export default React.memo(ExpandButton);
