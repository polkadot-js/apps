import styled from 'styled-components';

interface IProps {
  right?: boolean;
  padding?: string;
}

export const RowDiv = styled('div') <IProps>`
	align-items: stretch;
	display: flex;
	flex-wrap: nowrap;
	flex-direction: row;
	justify-content: flex-start;
	min-width: 0;
	text-align: ${props => (props.right ? 'right' : 'left')};
	padding: ${props => (props.padding ? props.padding : 0)};
`;

export const FullDiv = styled.div<IProps>`
	flex: 0 100%;
	text-align: ${props => (props.right ? 'right' : 'left')};
	padding: ${props => (props.padding ? props.padding : 0)};
`;

export const MediumDiv = styled('div') <IProps>`
	flex: 0 50%;
	text-align: ${props => (props.right ? 'right' : 'left')};
	padding: ${props => (props.padding ? props.padding : 0)};
`;
