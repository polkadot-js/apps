import React from 'react';
import styled from 'styled-components';
import { Button } from '@polkadot/react-components';
import { colors } from '../../../../styled-theming';

interface Props {
  collapse: () => void;
  isCollapsed: boolean;
}

const StyledButton = styled(Button).attrs({
  isBasic: true,
  isCircular: true
})`
  height: 2rem;
  margin: 0;
  position: absolute;
  right: -1.5rem;
  top: 2rem;
  transition: transform 0.15s;
  width: 2rem;
  z-index: 100;

  /* This is not a good css rule name convention, here is just for hacking to override default styles */
  .expanded &.ui.circular.button, .collapsed &.ui.circular.button {
    background: ${colors.N200} !important;
    box-shadow: none !important;
    color: ${colors.N900} !important;
  }

  .fixed & {
    display: none;
  }

  i {
    position: absolute;
    left: 7px;
    top: 8px;
  }
`;

function SideBarCollapseButton ({ collapse, isCollapsed }: Props): React.ReactElement<Props> {
  return (
    <StyledButton
      icon={`angle double ${isCollapsed ? 'right' : 'left'}`}
      onClick={collapse}
    />
  );
}

export default SideBarCollapseButton;
