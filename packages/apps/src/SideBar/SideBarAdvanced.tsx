import styled from 'styled-components';
import { colors } from '../../../../styled-theming';

const SideBarAdvancedContainer = styled.details`
  margin-top: 0.5rem;

  .expanded & {
    width: 100%;
  }

  .collapsed & {
    padding: 0;
    width: 3rem;
  }
`;

const SideBarAdvancedSummary = styled.summary`
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  padding-left: 0.75rem;

  &:hover{
    color: ${colors.N200};
  }

  .collapsed & {
    margin-left: 0.3rem;
    font-size: 1.5rem;

    span {
      display: none;
    }
  }
`;

export {
  SideBarAdvancedContainer,
  SideBarAdvancedSummary
};
