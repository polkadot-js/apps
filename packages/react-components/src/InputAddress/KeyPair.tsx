// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import AccountName from '../AccountName.js';
import { AzeroIdDomain } from '../AzeroId/index.js';
import IdentityIcon from '../IdentityIcon/index.js';
import { styled } from '../styled.js';

interface Props {
  address: string;
  className?: string;
  domain?: string | null;
  isUppercase: boolean;
  name: string;
  style?: Record<string, string>;
}

function KeyPair ({ address, className = '', domain }: Props): React.ReactElement<Props> {
  return (
    <StyledDiv className={`${className} ui--KeyPair`}>
      <IdentityIcon
        className='icon'
        value={address}
      />
      <div className='name'>
        <AccountName value={address} />
      </div>
      {domain && <StyledAzeroIdDomain domain={domain} />}
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

const StyledAzeroIdDomain = styled(AzeroIdDomain)`
  opacity: var(--opacity-light);
  font-size: var(--font-size-small);
`;

export default React.memo(KeyPair);
