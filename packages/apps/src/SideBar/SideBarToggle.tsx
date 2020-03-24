import React from 'react';
import styled from 'styled-components';
import { ChainImg, media } from '@polkadot/react-components';

interface Props {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const StyledChainImg = styled(ChainImg).attrs({
})`
  cursor: pointer;
  height: 2.75rem;
  left: 0.9rem;
  opacity: 0;
  position: absolute;
  top: 0px;
  transition: opacity 0.2s ease-in, top 0.2s ease-in;
  width: 2.75rem;

  &.delayed {
    transition-delay: 0.4s;
  }

  &.open {
    opacity: 1;
    top: 0.9rem;
  }

  ${media.DESKTOP`
    opacity: 0 !important;
    top: -2.9rem !important;
  `}
`;

function SideBarToggle ({ isMenuOpen, toggleMenu }: Props): React.ReactElement<Props> {
  return (
    <StyledChainImg
      className={`toggleImg ${isMenuOpen ? 'closed' : 'open delayed'}`}
      logo='cennznetDark'
      onClick={toggleMenu}
    />
  );
}

export default SideBarToggle;
