// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import AccountName from '@polkadot/react-components/AccountName';
import { Icon } from '@polkadot/react-components/index';

interface ParentAccountProps {
  address: string,
  className?: string
}

function ParentAddress ({ address, className }: ParentAccountProps): React.ReactElement<ParentAccountProps> {
  return (
    <div className={className}
      data-testid='parent'>
      <Icon className='parent-icon'
        icon='code-branch'/>
      <div className='parent-account-name'>
        <AccountName
          value={address}
          withSidebar
        >
        </AccountName>
      </div>
    </div>
  );
}

export default React.memo(styled(ParentAddress)`
    display: flex;
    flex-direction: row;
    font-size: 0.75rem;
    align-items: flex-end;
    color: #8B8B8B;

  & .parent-account-name {
    font-size: 0.8rem;
  }

  & .parent-icon {
    margin-right: 0.3rem;
  }
`);
