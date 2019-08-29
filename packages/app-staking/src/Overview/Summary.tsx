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
  currentValidatorsControllersV1OrStashesV2: string[];
  lastAuthor?: string;
  lastBlock: string;
  staking_validatorCount?: BN;
  next: string[];
}

function Summary (props: Props): React.ReactElement<Props> {
  const { className, currentValidatorsControllersV1OrStashesV2, lastAuthor, lastBlock, next, style, staking_validatorCount, t } = props;

  return (
    <SummaryBox
      className={className}
      style={style}
    >
      <section>
        <CardSummary label={t('validators')}>
          {currentValidatorsControllersV1OrStashesV2.length}/{staking_validatorCount ? staking_validatorCount.toString() : '-'}
        </CardSummary>
        <CardSummary label={t('waiting')}>
          {next.length}
        </CardSummary>
      </section>
      <section>
        <CardSummary label={t('last block')}>
          {lastAuthor && (
            <IdentityIcon
              className='validator--Account-block-icon'
              size={24}
              value={lastAuthor}
            />
          )}
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
  `,
  translate,
  withCalls<Props>('query.staking.validatorCount')
);
