// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ColFavoriteProps as Props } from '../types';

import React, { useCallback } from 'react';
import styled from 'styled-components';

import Icon from '../../Icon';

function Favorite ({ address, className = '', isFavorite, toggle }: Props): React.ReactElement<Props> {
  const onClick = useCallback(
    () => toggle(address),
    [address, toggle]
  );

  return (
    <td
      className={`ui--Table-Column-Favorite ${className}`}
      onClick={onClick}
    >
      <Icon
        color={
          isFavorite
            ? 'orange'
            : 'gray'
        }
        icon='star'
      />
    </td>
  );
}

export default React.memo(styled(Favorite)`
  && {
    cursor: pointer;
    min-width: 1rem;
    padding-right: 0;
    text-align: right;
    width: 1rem;
  }
`);
