// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StatusName } from './types.js';

import React from 'react';

import { styled } from '@polkadot/react-components';

import { insertSpaceBeforeCapitalLetter } from './helpers/index.js';

interface Props {
  bountyStatus: StatusName;
  className?: string;
}

function BountyStatusView ({ bountyStatus, className = '' }: Props): React.ReactElement<Props> {
  return (
    <StyledDiv
      className={className}
      data-testid={'bountyStatus'}
    >
      {insertSpaceBeforeCapitalLetter(bountyStatus)}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
`;

export default React.memo(BountyStatusView);
