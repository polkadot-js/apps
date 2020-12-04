// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import SUIMenu from 'semantic-ui-react/dist/commonjs/collections/Menu/Menu';
import SUIDivider from 'semantic-ui-react/dist/commonjs/elements/Divider/Divider';

type MenuDef = typeof SUIMenu & {
  Divider: typeof SUIDivider;
};

const Menu: MenuDef = SUIMenu as MenuDef;

Menu.Divider = SUIDivider;

export default Menu;
