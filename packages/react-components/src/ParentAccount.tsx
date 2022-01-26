// Copyright 2017-2022 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import AccountName from '@polkadot/react-components/AccountName';
import { Icon } from '@polkadot/react-components/index';

interface ParentAccountProps {
  address: string,
  className?: string
}

function ParentAccount ({ address, className }: ParentAccountProps): React.ReactElement<ParentAccountProps> {
  return (
    <div
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
    </div>
  );
}

export default React.memo(styled(ParentAccount)`
  align-items: center;
  color: #8B8B8B;
  font-size: 0.75rem;
  display: flex;

  & .parent-icon {
    font-size: 0.625rem;
    margin-right: 0.3rem;
    margin-left: 0.15rem;
  }
`);
