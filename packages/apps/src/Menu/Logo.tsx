import React from 'react';

import { styled } from '@polkadot/react-components';


interface Props {
  className?: string;
}

function Logo ({ className }: Props): React.ReactElement<Props> {
  return (
    <StyledDiv className={className}>
      <svg width="29" height="32" viewBox="0 0 29 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.5 9.30404L9.44667 6.89844V25.5604L0.5 27.8916V9.30404Z" fill="#44AFC2"/>
        <path d="M10.0683 2.98L18.5471 0.5L9.44667 6.9728L0.5 9.304L10.0683 2.98Z" fill="#67C4D5"/>
        <path d="M19.7136 27.5133L19.6367 12.8379L28.5065 10.3579V29.0881L19.72 27.5071L19.7136 27.5133Z"
              fill="#126276"/>
        <path d="M19.6367 12.838L28.5001 10.3518V22.7704L19.6367 12.838Z" fill="#115669"/>
        <path d="M12.1641 5.0136L18.5408 0.5L28.4937 10.358L19.6303 12.838L12.1641 5.0136Z" fill="#0A4C5D"/>
        <path d="M9.44667 25.5542L0.5 27.8854L19.6302 31.5L28.5 29.0944L9.44667 25.5604V25.5542Z" fill="#198798"/>
      </svg>
      <span>EstateXscan</span>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  color: var(--color-header);
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-weight: var(--font-weight-bold);
  letter-spacing: -1%;
`;

export default React.memo(Logo);
