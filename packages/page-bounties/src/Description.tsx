// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { styled } from '@polkadot/react-components';

interface Props {
  className?: string;
  dataTestId?: string;
  description: string;
}

function Description ({ className = '', dataTestId = '', description }: Props): React.ReactElement<Props> {
  return (
    <StyledDiv
      className={className}
      data-testid={dataTestId}
    >
      {description}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  margin-top: 0.28rem;
  font-size: var(--font-size-tiny);
  line-height: 0.85rem;
  color: var(--color-label);
`;

export default React.memo(Description);
