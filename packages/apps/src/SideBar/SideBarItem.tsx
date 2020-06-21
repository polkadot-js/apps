import { Menu } from '@polkadot/react-components';
import { NavLink } from 'react-router-dom';

import styled from 'styled-components';
import { colors } from '../../../../styled-theming';

const SideBarItem = styled(Menu.Item).attrs({
  className: 'apps--SideBar-Item'
})`
  align-self: flex-end;
  flex-grow: 0;
  margin: 0 !important;
  padding: 0 !important;

  .text {
    padding-left: 0.5rem;
  }

  .ui--Badge {
    margin: 0;
    position: absolute;
    right: 0.5rem;
    top: 0.55rem;
    z-index: 1;
  }

  .expanded & {
    width: 100%;
  }

  .collapsed & {
    margin: 0 !important;
    width: 3rem;

    .text {
      display: none;
    }
  }
`;

const SideBarItemDivider = styled.div`
  background: ${colors.textMuted};
  height: 1px;
  margin: 0.5rem 0;
  width: 100%;
`;

const SideBarItemLink = styled.a.attrs({
  className: 'apps--SideBar-Item-NavLink'
})`
  border-radius: 1.6rem;
  color: ${colors.textMuted};
  display: block;
  padding: 0.75rem;
  white-space: nowrap;

  &:hover {
    background: ${colors.N700};
    color: ${colors.N100};
    margin-right: 0.25rem;
  }
`;

const SideBarItemNavLink = styled(NavLink).attrs({
  className: 'apps--SideBar-Item-NavLink',
  activeClassName: 'apps--SideBar-Item-NavLink-active'
})`
  border-radius: 1.6rem;
  color: ${colors.textMuted};
  display: block;
  padding: 0.75em;
  white-space: nowrap;

  i.icon {
    width: 1.5rem;
  }

  &:hover {
    background: ${colors.N700};
    color: ${colors.N100};
  }

  &.apps--SideBar-Item-NavLink-active {
    background: ${colors.N1000};
    color: ${colors.N0};
  }
`;

const SideBarParentItem = styled.div`
  min-height: 46rem;
  .expanded & {
    width: 100%;
  }

  .collapsed & {
    margin: 0 !important;
    width: 3rem;
  }
`;

export {
  SideBarItem,
  SideBarItemDivider,
  SideBarItemNavLink,
  SideBarItemLink,
  SideBarParentItem
};
