// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
    (): void => onSelect(address),
    [address, onSelect]
  );

  if (isHidden) {
    return null;
  }

  return (
    <AddressToggle
      address={address}
      filter={filter}
      noLookup
      noToggle
      onChange={_onSelect}
    />
  );
}

export default React.memo(Available);
