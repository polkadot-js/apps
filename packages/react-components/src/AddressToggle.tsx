// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo } from 'react';

import { useApi, useDeriveAccountInfo } from '@polkadot/react-hooks';

import { checkVisibility } from './util/index.js';
import AddressMini from './AddressMini.js';
import { styled } from './styled.js';
import Toggle from './Toggle.js';

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
  const { apiIdentity } = useApi();
  const info = useDeriveAccountInfo(address);

  const isVisible = useMemo(
    () => info ? checkVisibility(apiIdentity, address, info, filter, false) : true,
    [address, filter, info, apiIdentity]
  );

  const _onClick = useCallback(
    () => onChange && onChange(!value),
    [onChange, value]
  );

  return (
    <StyledDiv
      className={`${className} ui--AddressToggle ${(value || noToggle) ? 'isAye' : 'isNay'} ${isHidden || !isVisible ? 'isHidden' : ''}`}
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
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
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
    opacity: var(--opacity-light);
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
`;

export default React.memo(AddressToggle);
