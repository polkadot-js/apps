// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountInfo } from '@polkadot/api-derive/types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { getAddressName } from './util';
import AddressMini from './AddressMini';
import Toggle from './Toggle';

interface Props {
  address: string;
  className?: string;
  filter?: string;
  onChange?: (isChecked: boolean) => void;
  value: boolean;
}

function AddressToggle ({ address, className, filter, onChange, value }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const info = useCall<DeriveAccountInfo>(api.derive.accounts.info as any, [address]);
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect((): void => {
    let isFiltered = true;

    if (!filter || address.includes(filter)) {
      isFiltered = false;
    } else if (info) {
      const [,, extracted] = getAddressName(address);
      const filterLower = filter.toLowerCase();

      if (extracted.toLowerCase().includes(filterLower)) {
        isFiltered = false;
      } else if (info) {
        const { accountId, accountIndex, identity, nickname } = info;

        if (identity.display?.toLowerCase().includes(filterLower) || accountId?.toString().includes(filter) || accountIndex?.toString().includes(filter) || nickname?.toLowerCase().includes(filterLower)) {
          isFiltered = false;
        }
      }
    }

    setIsFiltered(isFiltered);
  }, [filter, info, value]);

  if (isFiltered) {
    return null;
  }

  const _onClick = (): void => onChange && onChange(!value);

  return (
    <div
      className={`ui--AddressToggle ${className} ${value ? 'isAye' : 'isNay'}`}
      onClick={_onClick}
    >
      <AddressMini
        className='ui--AddressToggle-address'
        value={address}
      />
      <div className='ui--AddressToggle-toggle'>
        <Toggle
          label=''
          onChange={onChange}
          value={value}
        />
      </div>
    </div>
  );
}

export default styled(AddressToggle)`
  align-items: flex-start;
  border: 1px solid transparent; /* #eee */
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  margin: 0.125rem;
  padding: 0.125rem 0.25rem;
  text-align: left;
  vertical-align: middle;
  white-space: nowrap;

  .ui--AddressToggle-address {
    filter: grayscale(100%);
    opacity: 0.5;
  }

  &:hover {
    border-color: #ccc;
  }

  &.isAye {
    .ui--AddressToggle-address {
      filter: none;
      opacity: 1;
    }
    /* border-color: #ccc; */
  }

  .ui--AddressToggle-address,
  .ui--AddressToggle-toggle {
    flex: 1;
    padding: 0;
  }

  .ui--AddressToggle-toggle {
    margin-top: 0.1rem;
    text-align: right;
  }
`;
