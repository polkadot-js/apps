/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import SummarySession from '@polkadot/app-explorer/SummarySession';
import { CardSummary, IdentityIcon, SummaryBox } from '@polkadot/ui-app';
import { withCalls, withMulti } from '@polkadot/ui-api';

import translate from '../translate';

interface Props extends I18nProps {
  className?: string;
  allControllers: string[];
  lastAuthor?: string;
  lastBlock: string;
  staking_validatorCount?: BN;
  currentValidatorsControllersV1OrStashesV2: string[];
}

class Summary extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className, allControllers, lastAuthor, lastBlock, style, t, staking_validatorCount, currentValidatorsControllersV1OrStashesV2 } = this.props;
    const waiting = allControllers.length > currentValidatorsControllersV1OrStashesV2.length
      ? (allControllers.length - currentValidatorsControllersV1OrStashesV2.length)
      : 0;

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
            {waiting}
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
