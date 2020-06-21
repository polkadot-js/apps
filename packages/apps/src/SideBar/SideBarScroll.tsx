import styled from 'styled-components';
import { colors } from '../../../../styled-theming';

const SideBarScroll = styled.div.attrs({
  className: 'apps--SideBar-Scroll'
})`
  @media (min-width:1000px){
    .expanded & {
      position: fixed;
    }
  }
  align-items: center;
  color: ${colors.textMuted};
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  padding: 0 1.4rem;
  scrollbar-width: none;
  user-select: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0px;
  }
`;

export default SideBarScroll;
