// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { Icon } from '@polkadot/react-components';
import { ThemeProps } from '@polkadot/react-components/types';

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
  font-weight: 700;
  font-size: 0.857rem;
  line-height: 1.714rem;
  color: ${theme.theme === 'dark' ? '#BDBDBD' : '#1A1B20'};

  .title{
    margin-bottom: 0.285rem;
    svg {
      color: ${theme.theme === 'dark' ? '#BDBDBD' : '#424242'};
    }
  }

  .description {
    font-weight: 400;
    font-size: 0.714rem;
    line-height: 0.864rem;
    color: ${theme.theme === 'dark' ? '#757575' : '#8B8B8B'};
  }
`));
