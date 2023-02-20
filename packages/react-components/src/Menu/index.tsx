// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BaseProps, MenuType } from './types';

import React from 'react';

import { styled } from '../styled';
import Divider from './Divider';
import Header from './Header';
import Item from './Item';

function Base ({ children, className = '' }: BaseProps): React.ReactElement<BaseProps> {
  return (
    <StyledDiv className={`${className} ui--Menu`}>
      {children}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 14.286rem;
  margin: 1rem 0;

  & > *:not(.ui--Menu__Item):not(.ui--Menu__Divider) {
    margin-right: 1rem;
    margin-left: 1rem;
  }
`;

const Menu = React.memo(Base) as unknown as MenuType;

Menu.Divider = Divider;
Menu.Item = Item;
Menu.Header = Header;

export default Menu;
