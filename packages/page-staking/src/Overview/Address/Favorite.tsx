// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback } from 'react';
import { Icon } from '@polkadot/react-components';

interface Props {
  address: string;
  isFavorite: boolean;
  toggleFavorite: (accountId: string) => void;
}

function Favorite ({ address, isFavorite, toggleFavorite }: Props): React.ReactElement<Props> {
  const _onFavorite = useCallback(
    (): void => toggleFavorite(address),
    [address, toggleFavorite]
  );

  return (
    <td className='favorite'>
      <Icon
        className={`${isFavorite && 'isSelected isColorHighlight'}`}
        name={isFavorite ? 'star' : 'star outline'}
        onClick={_onFavorite}
      />
    </td>
  );
}

export default React.memo(Favorite);
