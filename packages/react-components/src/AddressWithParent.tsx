// [object Object]
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { AddressSmall, Icon } from '@polkadot/react-components';
import { ThemeProps } from '@polkadot/react-components/types';
import { AccountId, Address } from '@polkadot/types/interfaces';
import AccountName from "@polkadot/react-components/AccountName";

interface AddressSmallProps {
  address?: string | Address | AccountId | null | Uint8Array;
  className?: string,
}

interface Props extends AddressSmallProps {
  parentAddress?: string | Address | AccountId | null | Uint8Array;
}

function AddressWithParent ({ address, className, parentAddress }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <div className='parent'
        data-testid='parent'>
        <Icon className='parent-icon'
          icon='code-branch'/>
        <div className='parent-account'>
          <AccountName
            value={parentAddress}
            withSidebar
          >
          </AccountName>
        </div>
      </div>
      <AddressSmall value={address} />
    </div>
  );
}

export default React.memo(styled(AddressWithParent)(({ theme }: ThemeProps) => `
  & .parent {
    display: flex;
    flex-direction: row;
    font-size: 0.75rem;
    align-items: flex-end;
    color: #8B8B8B;
  }

  & .parent-account {
    font-size: 0.8rem;
  }

  & .parent-icon {
    margin-right: 0.2rem;
  }
`));
