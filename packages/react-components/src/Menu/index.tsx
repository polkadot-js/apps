// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BaseProps, DividerProps, HeaderProps, ItemProps } from './types';

import React from 'react';

import MenuBase from './Base';
import Divider from './Divider';
import Header from './Header';
import Item from './Item';

type MenuDef = React.FC<BaseProps> & {
  Divider: React.FC<DividerProps>;
  Item: React.FC<ItemProps>;
  Header: React.FC<HeaderProps>;
};

const Menu: MenuDef = MenuBase as unknown as MenuDef;

Menu.Divider = Divider;
Menu.Item = Item;
Menu.Header = Header;

export default Menu;
