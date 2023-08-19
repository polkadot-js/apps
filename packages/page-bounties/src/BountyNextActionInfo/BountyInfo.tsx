// Copyright 2017-2023 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Icon, styled } from '@polkadot/react-components';
import { useTheme } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  description: string;
  type?: 'info' | 'warning';
}

function BountyInfo ({ className = '', description, type = 'info' }: Props): React.ReactElement<Props> {
  const { themeClassName } = useTheme();

  return (
    <StyledDiv className={`${themeClassName} ${className}`}>
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

  &.theme--dark {
    .info-icon {
      margin-right: 0.2rem;

      svg {
        color: #8E8E8E;
      }
    }
  }

  &.theme--light {
    .info-icon {
      margin-right: 0.2rem;

      svg {
        color: #4D4D4D;
      }
    }
  }

  .info-icon {
    margin-right: 0.2rem;
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
