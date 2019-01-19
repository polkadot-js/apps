// Copyright 2017-2019 @polkadot/app-nodeinfo authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { Info } from './types';

import React from 'react';
import { CardSummary } from '@polkadot/ui-app/index';
import { BestNumber } from '@polkadot/ui-reactive/index';

import translate from './translate';

type Props = I18nProps & {
  info: Info;
};

class Summary extends React.PureComponent<Props> {
  render () {
    const { info = {}, t } = this.props;

    return (
      <summary>
        <section>
          <CardSummary label={t('total peers')}>
            {
              info.health
                ? `${info.health.peers.toNumber()}`
                : '-'
            }
          </CardSummary>
          <CardSummary label={t('syncing')}>
            {
              info.health
                ? (
                  info.health.isSyncing.valueOf()
                    ? t('yes')
                    : t('no')
                )
                : '-'
            }
          </CardSummary>
        </section>
        <section>
          <CardSummary label={t('queued tx')}>
            {
              info.extrinsics
                ? `${info.extrinsics.length}`
                : '-'
            }
          </CardSummary>
        </section>
        <section>
          <CardSummary label={t('best')}>
            <BestNumber />
          </CardSummary>
        </section>
      </summary>
    );
  }
}

export default translate(Summary);
