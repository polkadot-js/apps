// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Input from './Input.js';
import { styled } from './styled.js';

interface Props {
  className?: string;
  filterOn: string;
  label: string;
  setFilter: (filter: string) => void;
}

function Filter ({ className = '', filterOn, label, setFilter }: Props) {
  return (
    <StyledDiv className={className}>
      <Input
        autoFocus
        isFull
        label={label}
        onChange={setFilter}
        value={filterOn}
      />
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  width: 29.5rem;

  .ui--Input {
    margin: 0;
    height: 3.893rem;
  }
`;

export default React.memo(Filter);
