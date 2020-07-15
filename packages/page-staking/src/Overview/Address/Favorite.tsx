// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Icon } from '@polkadot/react-components';

interface Props {
  address: string;
  className?: string;
  isFavorite: boolean;
  toggleFavorite: (accountId: string) => void;
}

function Favorite ({ address, className, isFavorite, toggleFavorite }: Props): React.ReactElement<Props> {
  const _onFavorite = useCallback(
    (): void => toggleFavorite(address),
    [address, toggleFavorite]
  );

  return (
    <Icon
      className={className}
      color={isFavorite ? 'orange' : 'gray'}
      icon='star'
      onClick={_onFavorite}
    />
  );
}

export default React.memo(styled(Favorite)`
  margin-right: 1rem;
`);
