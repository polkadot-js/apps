// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import SUIDivider from 'semantic-ui-react/dist/es/elements/Divider';
import SUIMenu from 'semantic-ui-react/dist/es/collections/Menu';

type MenuDef = typeof SUIMenu & {
  Divider: typeof SUIDivider
};

// $FlowFixMe we areally want to do this, yes
const Menu: MenuDef = SUIMenu;

Menu.Divider = SUIDivider;

export default Menu;
