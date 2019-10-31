/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import SummarySession from '@polkadot/app-explorer/SummarySession';
import { CardSummary, IdentityIcon, SummaryBox } from '@polkadot/react-components';
import { withCalls, withMulti } from '@polkadot/react-api';

import translate from '../translate';

interface Props extends I18nProps {
  allControllers: string[];
  className?: string;
  currentValidators: string[];
  lastAuthors?: string[];
  lastBlock: string;
  staking_validatorCount?: BN;
  next: string[];
}

function Summary ({ className, currentValidators, lastAuthors, lastBlock, next, style, staking_validatorCount, t }: Props): React.ReactElement<Props> {
  return (
    <SummaryBox
      className={className}
      style={style}
    >
      <section>
        <CardSummary label={t('validators')}>
          {currentValidators.length}/{staking_validatorCount ? staking_validatorCount.toString() : '-'}
        </CardSummary>
        <CardSummary label={t('waiting')}>
          {next.length}
        </CardSummary>
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

export default withMulti(
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
  `,
  translate,
  withCalls<Props>('query.staking.validatorCount')
);
