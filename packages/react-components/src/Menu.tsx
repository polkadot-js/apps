// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Divider as SUIDivider, Menu as SUIMenu } from 'semantic-ui-react';
import styled from 'styled-components';

type MenuDef = typeof SUIMenu & {
  Divider: typeof SUIDivider;
};

const Menu: MenuDef = SUIMenu as MenuDef;

Menu.Divider = SUIDivider;

export default styled(Menu)`
  .ui.divider {
    display: none;
  }

  .item+.ui.divider {
    display: block;
  }
`;
