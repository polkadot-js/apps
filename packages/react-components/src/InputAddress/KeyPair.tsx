// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import styled from 'styled-components';

import AccountName from '../AccountName';
import IdentityIcon from '../IdentityIcon';
import { toShortAddress } from '../util/toShortAddress';

interface Props {
  address: string;
  className?: string;
  isUppercase: boolean;
  name: string;
  style?: Record<string, string>;
}

function KeyPair ({ address, className = '' }: Props): React.ReactElement<Props> {
  const shortAddr = useMemo(
    () => toShortAddress(address),
    [address]
  );

  return (
    <div className={`ui--KeyPair ${className}`}>
      <IdentityIcon
        className='icon'
        value={address}
      />
      <div className='name'>
        <AccountName value={address} />
      </div>
      <div className='address'>
        {shortAddr}
      </div>
    </div>
  );
}

export default React.memo(styled(KeyPair)`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  position: relative;
  white-space: nowrap;

  > .address {
    display: inline-block;
    flex: 1;
    font: var(--font-mono);
    font-size: var(--font-size-small);
    margin-left: 1rem;
    opacity: 0.6;
    overflow: hidden;
    text-align: right;
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
`);
