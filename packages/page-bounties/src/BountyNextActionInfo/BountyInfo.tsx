// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Icon, styled } from '@polkadot/react-components';

interface Props {
  className?: string;
  description: string;
  type?: 'info' | 'warning';
}

function BountyInfo ({ className = '', description, type = 'info' }: Props): React.ReactElement<Props> {
  return (
    <StyledDiv className={className}>
      {type === 'warning' && (
        <div className='info-icon'>
          <Icon icon={'exclamation-triangle'} />
        </div>
      )}
      <div className='description'>
        {description}
      </div>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--font-size-small);
  line-height: 1.5rem;

  .info-icon {
    margin-right: 0.2rem;

    svg {
      color: var(--color-bounty-info);
    }
  }

  .description {
    font-weight: var(--font-weight-normal);
    var(font-size: var(--font-size-tiny);)
    line-height: 0.864rem;
    color: var(--color-label);
    word-wrap: break-word;
  }
`;

export default React.memo(BountyInfo);
