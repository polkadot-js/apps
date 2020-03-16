import styled from 'styled-components';
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
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  height: auto;
  position: relative;
  transition: left 0.3s linear;
  width: 100%;
`;

SideBar.defaultProps = {
  key: 'AppSideBar'
};

export default SideBar;
