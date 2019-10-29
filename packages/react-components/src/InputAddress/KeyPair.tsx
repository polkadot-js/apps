// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import { AccountName } from '@polkadot/react-query';

import IdentityIcon from '../IdentityIcon';

interface Props {
  address: string;
  className?: string;
  isUppercase: boolean;
  name: string;
  style?: Record<string, string>;
}

function KeyPair ({ address, className, style }: Props): React.ReactElement<Props> {
  return (
    <div
      className={['ui--KeyPair', className].join(' ')}
      style={style}
    >
      <IdentityIcon
        className='icon'
        size={32}
        value={address}
      />
      <div className='name'>
        <AccountName params={address} />
      </div>
      <div className='address'>
        {address}
      </div>
    </div>
  );
}

export default styled(KeyPair)`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  position: relative;
  white-space: nowrap;

  > .address {
    display: inline-block;
    flex: 1;
    font-family: monospace;
    margin-left: 1rem;
    opacity: 0.5;
    overflow: hidden;
    text-align: right;
    text-overflow: ellipsis;
  }

  > .icon {
    position: absolute;
    top: -9px;
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
