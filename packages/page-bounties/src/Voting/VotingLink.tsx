// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { Icon } from '@polkadot/react-components';
import { ThemeProps } from '@polkadot/react-components/types';

import Description from '../Description';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

function VotingLink ({ className }: Props): React.ReactElement<string> {
  const { t } = useTranslation();

  return (
    <>
      <div className={className}>
        <a
          className='voting-summary-text'
          href='#/council/motions'
        >
          <b>{t('Voting')}</b>
          <Icon
            className='voting-icon'
            icon='chevron-right'
          />
        </a>
        <Description description={t<string>('Go to motions panel')} />
      </div>
    </>
  );
}

export default React.memo(styled(VotingLink)(({ theme }: ThemeProps) => `
  .voting-summary-text {
    font-size: 0.85rem;
    line-height: 0.5rem;
    color: ${theme.theme === 'dark' ? '#eeeeee' : '#1a1b20'} !important;
  }

  .voting-icon {
    margin-left: 0.3rem;
    margin-bottom: 0.1rem;
    width: 0.4rem;
    height: 0.4rem;
  }
`));
