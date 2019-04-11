// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import SummarySession from '@polkadot/app-explorer/SummarySession';
import { AddressMini, SummaryBox, CardSummary } from '@polkadot/ui-app';
import { withCall, withMulti } from '@polkadot/ui-api';

import translate from '../translate';

type Props = I18nProps & {
  balances: DerivedBalancesMap,
  controllers: Array<string>,
  lastAuthor?: string,
  lastBlock: string,
  lastLengthChange?: BN,
  staking_validatorCount?: BN,
  validators: Array<string>
};

class Summary extends React.PureComponent<Props> {
  render () {
    const { className, controllers, lastAuthor, lastBlock, style, t, staking_validatorCount, validators } = this.props;
    const waiting = controllers.length > validators.length
      ? (controllers.length - validators.length)
      : 0;

    return (
      <SummaryBox
        className={className}
        style={style}
      >
        <section>
          <CardSummary label={t('validators')}>
            {validators.length}/{staking_validatorCount ? staking_validatorCount.toString() : '-'}
          </CardSummary>
          <CardSummary label={t('waiting')}>
            {waiting}
          </CardSummary>
        </section>
        <section>
          <CardSummary label={t('last block')}>
            {lastAuthor && (
              <AddressMini
                className='summary'
                isPadded={false}
                value={lastAuthor}
                withAddress={false}
              />
            )}
            {lastBlock}
          </CardSummary>
        </section>
        <section>
          <SummarySession withBroken={false} />
        </section>
      </SummaryBox>
    );
  }
}

export default withMulti(
  Summary,
  translate,
  withCall('query.staking.validatorCount')
);
