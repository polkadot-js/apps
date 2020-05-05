// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import SUIDivider from 'semantic-ui-react/dist/commonjs/elements/Divider/Divider';
import SUIMenu from 'semantic-ui-react/dist/commonjs/collections/Menu/Menu';

type MenuDef = typeof SUIMenu & {
  Divider: typeof SUIDivider;
};

const Menu: MenuDef = SUIMenu as MenuDef;

Menu.Divider = SUIDivider;

export default Menu;
