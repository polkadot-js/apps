// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Address, AccountId } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';
import { AccountIndex, AccountName } from '@polkadot/react-query';

import IdentityIcon from './IdentityIcon';

interface Props {
  className?: string;
  defaultName?: string;
  onClickName?: () => void;
  overrideName?: React.ReactNode;
  toggle?: any;
  value?: string | Address | AccountId;
}

function AddressSmall ({ className, defaultName, onClickName, overrideName, toggle, value }: Props): React.ReactElement<Props> {
  return (
    <div className={`ui--AddressSmall ${className}`}>
      <IdentityIcon
        size={32}
        value={value}
      />
      <div className='nameInfo'>
        <AccountName
          className={(overrideName || !onClickName) ? '' : 'name--clickable'}
          defaultName={defaultName}
          override={overrideName}
          onClick={onClickName}
          params={value}
          toggle={toggle}
        />
        <AccountIndex params={value} />
      </div>
    </div>
  );
}

export default styled(AddressSmall)`
  vertical-align: middle;
  white-space: nowrap;

  .name--clickable {
    cursor: pointer;
  }

  .ui--IdentityIcon,
  .nameInfo {
    display: inline-block;
    vertical-align: middle;
  }

  .ui--IdentityIcon {
    margin-right: 0.75rem;
  }

  .nameInfo {
    > div {
      max-width: 16rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;
