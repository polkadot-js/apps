import React from 'react';
import { Responsive } from 'semantic-ui-react';
import { classes } from '@polkadot/react-components/util';
import styled from 'styled-components';

interface Props {
  children: any;
  className?: string;
  handleResize: () => void;
  isCollapsed: boolean;
}

const StyledResponsive = styled(Responsive)`
  display: flex;
  position: relative;
  transition: width 0.3s linear;
  z-index: 300;

  .fixed & {
    position: absolute;
    width: 0px;

    .apps--SideBar {
      padding-left: 0;
    }
  }

  .menu-open & {
    width: 15rem;
  }
`;

function SideBarWrapper ({ children, className, handleResize, isCollapsed }: Props): React.ReactElement<Props> {
  return (
    <StyledResponsive
      onUpdate={handleResize}
      className={classes(className, 'apps--SideBar-Wrapper', isCollapsed ? 'collapsed' : 'expanded')}
    >{children}</StyledResponsive>
  );
}

export default SideBarWrapper;
