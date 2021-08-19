// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ItemProps } from './types';

import React, { useCallback } from 'react';
import styled from 'styled-components';

import Icon from '../Icon';

function Item ({ children, className = '', disabled, icon, onClick }: ItemProps): React.ReactElement<ItemProps> {
  const _onClick = useCallback(
    () => !disabled && onClick && onClick(),
    [disabled, onClick]
  );

  return (
    <div
      className={`ui--Menu__Item ${className}`}
      onClick={_onClick}
    >
      {icon && (
        <Icon
          color='darkGray'
          icon={icon}
        />
      )}
      {children}
    </div>
  );
}

export default React.memo(styled(Item)`
  display: flex;
  flex-direction: row;
  align-items: center;

  font-size: 0.93rem;
  line-height: 0.93rem;

  margin-bottom: 1rem;

  .ui--Icon {
    margin-right: 0.666rem;
  }
`);
