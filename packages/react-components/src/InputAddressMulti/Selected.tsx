// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback } from 'react';

import AddressToggle from '../AddressToggle';

interface Props {
  address: string;
  filter?: string;
  isHidden?: boolean;
  onDeselect: (address: string) => void;
}

function Selected ({ address, filter, isHidden, onDeselect }: Props): React.ReactElement<Props> | null {
  const _onDeselect = useCallback(
    (): void => onDeselect(address),
    [address, onDeselect]
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
      onChange={_onDeselect}
    />
  );
}

export default React.memo(Selected);
