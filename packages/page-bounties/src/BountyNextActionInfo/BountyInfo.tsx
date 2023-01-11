// Copyright 2017-2023 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';

import { Icon } from '@polkadot/react-components';

import { bountySvgColor } from '../theme';

interface Props {
  className: '';
  description: string;
  type?: 'info' | 'warning';
}

function BountyInfo ({ className = '', description, type = 'info' }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      {type === 'warning' && (
        <div className='info-icon'>
          <Icon icon={'exclamation-triangle'} />
        </div>
      )}
      <div className='description'>
        {description}
      </div>
    </div>
  );
}

export default React.memo(styled(BountyInfo)(({ theme }: ThemeProps) => `
  display: flex;
  align-items: center;
  font-size: var(--font-size-small);
  line-height: 1.5rem;

  .info-icon{
    margin-right: 0.2rem;
    svg {
      color: ${bountySvgColor[theme.theme]};
    }
  }

  .description {
    font-weight: var(--font-weight-normal);
    var(font-size: var(--font-size-tiny);)
    line-height: 0.864rem;
    color: var(--color-label);
    word-wrap: break-word;
  }
`));
