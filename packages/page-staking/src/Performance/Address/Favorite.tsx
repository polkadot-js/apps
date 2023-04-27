// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';

import { Icon, styled } from '@polkadot/react-components';

interface Props {
  address: string;
  className?: string;
  isFavorite: boolean;
  toggleFavorite: (accountId: string) => void;
}

function Favorite ({ address, className, isFavorite, toggleFavorite }: Props): React.ReactElement<Props> {
  const onFavorite = useCallback(
    () => toggleFavorite(address),
    [address, toggleFavorite]
  );

  return (
    <Icon
      className={className}
      color={isFavorite ? 'orange' : 'gray'}
      icon='star'
      onClick={onFavorite}
    />
  );
}

export default React.memo(styled(Favorite)`
  margin-right: 1rem;
`);
