// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import { truncate } from '@canvas-ui/react-util';
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
    <div className={['ui--KeyPair', className].join(' ')}>
      <IdentityIcon
        className='icon'
        value={address}
      />
      <div className='info'>
        <div className='name'>
          <AccountName value={address} />
        </div>
        <div className='address'>
          {truncate(address, 8)}
        </div>
      </div>
    </div>
  );
}

export default React.memo(styled(KeyPair)`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  position: relative;
  white-space: nowrap;

  > .info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1 0;
    padding-left: 0.75rem;

    > .address {
      color: var(--grey60);
      // font-family: monospace;
      font-size: 0.75rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }  

    > .name {
      color: var(--white);
      font-weight: 600;
      margin-bottom: 0.15rem;
      line-height: 0.5rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`);
