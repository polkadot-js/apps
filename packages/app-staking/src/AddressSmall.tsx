// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Address, AccountId } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';
import { IdentityIcon } from '@polkadot/react-components';
import { AccountIndex, AccountName } from '@polkadot/react-query';

interface Props {
  className?: string;
  defaultName?: string;
  value?: string | Address | AccountId;
}

function AddressSmall ({ className, defaultName, value }: Props): React.ReactElement<Props> {
  return (
    <div className={`ui--AddressSmall ${className}`}>
      <IdentityIcon
        size={32}
        value={value}
      />
      <div className='nameInfo'>
        <AccountName defaultName={defaultName} params={value} />
        <AccountIndex params={value} />
      </div>
    </div>
  );
}

export default styled(AddressSmall)`
  vertical-align: middle;
  white-space: nowrap;

  .ui--IdentityIcon,
  .nameInfo {
    display: inline-block;
    vertical-align: middle;
  }

  .ui--IdentityIcon {
    margin-right: 0.75rem;
  }

  .nameInfo > div {
    max-width: 16rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
