import React from 'react';
import styled from 'styled-components';

interface Props {
  isMenuOpen: boolean;
  _handleResize: () => void;
}

const StyledBg = styled.div`
  background: rgba(0,0,0,0.6);
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  transition: opacity 0.2s;
  width: 100%;
  z-index: 299;

  &.closed {
    opacity: 0;
    width: 0;
  }

  &.open {
    opacity: 1;
  }
`;

function MenuOverlay ({ _handleResize, isMenuOpen }: Props): React.ReactElement<Props> {
  return (
    <StyledBg
      className={`apps--Menu-bg ${isMenuOpen ? 'open' : 'closed'}`}
      onClick={_handleResize}
    />
  );
}

export default MenuOverlay;
