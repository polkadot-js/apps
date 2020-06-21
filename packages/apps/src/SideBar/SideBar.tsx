import styled from 'styled-components';
import { colors } from '../../../../styled-theming';
import { ThemeProps } from '../../../../styled-theming/types';

const defaultThemeStyle = (p: ThemeProps): object => {
  const { colors } = p.theme;

  return {
    background: colors.N900
  };
};

const computedThemeStyle = (p: ThemeProps): any => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const SideBar = styled.div.attrs({
  className: 'apps--SideBar'
})`
  align-items: center;
  background: ${(p: any): string => computedThemeStyle(p).background};
  border-top: 8px solid ${colors.primary};
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  height: auto;
  overflow: hidden;
  position: relative;
  transition: left 0.3s linear;
  width: 100%; /* important to sidebar hidden in mobile view */

  .collapsed & {
    @media (min-width:1000px){
      .ui.vertical.menu {
        position: fixed;
      }
    }
    width: 5rem;
  }

  /* .expanded & {
    width: 15rem;
  } */
`;

SideBar.defaultProps = {
  key: 'AppSideBar'
};

export default SideBar;
