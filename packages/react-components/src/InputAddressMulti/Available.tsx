// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';

import AddressToggle from '../AddressToggle';

interface Props {
  address: string;
  filter: string;
  isHidden?: boolean;
  onSelect: (address: string) => void;
}

function Available ({ address, filter, isHidden, onSelect }: Props): React.ReactElement<Props> | null {
  const _onSelect = useCallback(
    () => onSelect(address),
    [address, onSelect]
  );

  if (isHidden) {
    return null;
  }

  return (
    <AddressToggle
      address={address}
      filter={filter}
      noToggle
      onChange={_onSelect}
    />
  );
}

export default React.memo(Available);
