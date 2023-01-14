// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import AccountName from '../AccountName';
import IdentityIcon from '../IdentityIcon';

interface Props {
  address: string;
  className?: string;
  isUppercase: boolean;
  name: string;
  style?: Record<string, string>;
}

function KeyPair ({ address, className = '' }: Props): React.ReactElement<Props> {
  return (
    <StyledDiv className={`ui--KeyPair ${className}`}>
      <IdentityIcon
        className='icon'
        value={address}
      />
      <div className='name'>
        <AccountName value={address} />
      </div>
      <div className='address'>
        {address}
      </div>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  position: relative;
  white-space: nowrap;

  > .address {
    display: inline-block;
    flex: 1;
    font-size: var(--font-size-small);
    margin-left: 1rem;
    max-width: var(--width-shortaddr);
    min-width: var(--width-shortaddr);
    opacity: var(--opacity-light);
    overflow: hidden;
    text-align: right;
    text-overflow: ellipsis;
  }

  > .icon {
    position: absolute;
    top: -5px;
    left: 0;
  }

  > .name {
    display: inline-block;
    flex: 1 0;
    margin-left: 3rem;
    overflow: hidden;
    text-overflow: ellipsis;

    &.uppercase {
      text-transform: uppercase;
    }
  }
`;

export default React.memo(KeyPair);
