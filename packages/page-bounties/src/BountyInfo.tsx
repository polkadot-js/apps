// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { Icon } from '@polkadot/react-components';
import { ThemeProps } from '@polkadot/react-components/types';

import { bountyColor, bountyLabelColor, bountySvgColor } from './theme';
import { useTranslation } from './translate';

interface Props {
  className: '';
  description: string;
  type?: 'info' | 'warning';
}

function BountyInfo ({ className = '', description, type = 'info' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <div className='title'>
        { type === 'warning' && <Icon icon={'exclamation-triangle'}/> } {type === 'info' ? t('Info') : t('Warning')}
      </div>
      <div className='description'>
        {description}
      </div>
    </div>
  );
}

export default React.memo(styled(BountyInfo)(({ theme }: ThemeProps) => `
  font-weight: 500;
  font-size: 0.857rem;
  line-height: 1.714rem;
  color: ${bountyColor[theme.theme]};

  .title{
    margin-bottom: 0.285rem;
    svg {
      color: ${bountySvgColor[theme.theme]};
    }
  }

  .description {
    font-weight: 400;
    font-size: 0.714rem;
    line-height: 0.864rem;
    color: ${bountyLabelColor[theme.theme]};
  }
`));
