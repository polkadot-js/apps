// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import AccountName from './AccountName.js';
import Icon from './Icon.js';
import { styled } from './styled.js';

interface ParentAccountProps {
  address: string,
  className?: string
}

function ParentAccount ({ address, className }: ParentAccountProps): React.ReactElement<ParentAccountProps> {
  return (
    <StyledDiv
      className={className}
      data-testid='parent'
    >
      <Icon
        className='parent-icon'
        icon='code-branch'
      />
      <AccountName
        value={address}
        withSidebar
      >
      </AccountName>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  align-items: center;
  color: #8B8B8B;
  var(--font-size-small);
  display: flex;

  & .parent-icon {
    font-size: var(--font-size-percent-small);
    margin-right: 0.3rem;
    margin-left: 0.15rem;
  }
`;

export default React.memo(ParentAccount);
