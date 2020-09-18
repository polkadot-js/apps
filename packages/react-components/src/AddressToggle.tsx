// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveAccountInfo } from '@polkadot/api-derive/types';

import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import AddressMini from './AddressMini';
import Toggle from './Toggle';
import { checkVisibility } from './util';

interface Props {
  address: string;
  className?: string;
  isHidden?: boolean;
  filter?: string;
  noToggle?: boolean;
  onChange?: (isChecked: boolean) => void;
  value?: boolean;
}

function AddressToggle ({ address, className = '', filter, isHidden, noToggle, onChange, value }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const info = useCall<DeriveAccountInfo>(api.derive.accounts.info, [address]);

  const isVisible = useMemo(
    () => info ? checkVisibility(api, address, info, filter, false) : true,
    [api, address, filter, info]
  );

  const _onClick = useCallback(
    () => onChange && onChange(!value),
    [onChange, value]
  );

  return (
    <div
      className={`ui--AddressToggle ${className}${(value || noToggle) ? ' isAye' : ' isNay'}${isHidden || !isVisible ? ' isHidden' : ''}`}
      onClick={_onClick}
    >
      <AddressMini
        className='ui--AddressToggle-address'
        value={address}
        withSidebar={false}
      />
      {!noToggle && (
        <div className='ui--AddressToggle-toggle'>
          <Toggle
            label=''
            value={value}
          />
        </div>
      )}
    </div>
  );
}

export default React.memo(styled(AddressToggle)`
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

  &.isHidden {
    display: none;
  }

  &.isDragging {
    background: white;
    box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.15);
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

  &.isAye {
    .ui--AddressToggle-address {
      filter: none;
      opacity: 1;
    }
  }
`);
