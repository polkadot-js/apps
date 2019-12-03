// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedStakingOverview } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';
import SummarySession from '@polkadot/app-explorer/SummarySession';
import { CardSummary, IdentityIcon, SummaryBox } from '@polkadot/react-components';

import translate from '../translate';

interface Props extends I18nProps {
  allControllers: string[];
  className?: string;
  lastAuthors?: string[];
  lastBlock?: string;
  next: string[];
  stakingOverview?: DerivedStakingOverview;
}

function Summary ({ className, lastAuthors, lastBlock, next, stakingOverview, style, t }: Props): React.ReactElement<Props> {
  return (
    <SummaryBox
      className={className}
      style={style}
    >
      <section>
        {stakingOverview && (
          <CardSummary label={t('validators')}>
            {stakingOverview.validators.length}{`/${stakingOverview.validatorCount.toString()}`}
          </CardSummary>
        )}
        {next && (
          <CardSummary label={t('waiting')}>
            {next.length}
          </CardSummary>
        )}
      </section>
      <section>
        <CardSummary
          className='validator--Summary-authors'
          label={t('last block')}
        >
          {lastAuthors && lastAuthors.map((author): React.ReactNode => (
            <IdentityIcon
              className='validator--Account-block-icon'
              key={author}
              size={24}
              value={author}
            />
          ))}
          {lastBlock}
        </CardSummary>
      </section>
      <section>
        <SummarySession />
      </section>
    </SummaryBox>
  );
}

export default translate(
  styled(Summary)`
    .validator--Account-block-icon {
      margin-right: 0.75rem;
      margin-top: -0.25rem;
      vertical-align: middle;
    }

    .validator--Summary-authors {
      .validator--Account-block-icon+.validator--Account-block-icon {
        margin-left: -1.5rem;
      }
    }
  `
);
