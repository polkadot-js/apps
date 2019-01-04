// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { ReferendumInfo } from '@polkadot/types';
import { withCall, withMulti } from '@polkadot/ui-react-rx/with/index';

import Referendum from './Referendum';
import translate from './translate';

type Props = I18nProps & {
  query_democracy_nextTally?: BN,
  query_democracy_referendumCount?: BN,
  derive_democracy_referendums?: Array<ReferendumInfo>
};

class Referendums extends React.PureComponent<Props> {
  render () {
    const { t } = this.props;

    return (
      <section className='democracy--Referendums'>
        <h1>{t('referendums.header', {
          defaultValue: 'referendums'
        })}</h1>
        {this.renderReferendums()}
      </section>
    );
  }

  private renderReferendums () {
    const { query_democracy_nextTally, derive_democracy_referendums, query_democracy_referendumCount, t } = this.props;
    const referendumCount = (query_democracy_referendumCount || new BN(0)).toNumber();

    if (!derive_democracy_referendums || !derive_democracy_referendums.length || (referendumCount === (query_democracy_nextTally || new BN(0)).toNumber())) {
      return (
        <div className='ui disabled'>
          {t('proposals.none', {
            defaultValue: 'no available referendums'
          })}
        </div>
      );
    }

    const startIndex = referendumCount - derive_democracy_referendums.length;

    return derive_democracy_referendums.map((referendum, index) => (
      <Referendum
        idNumber={index + startIndex}
        key={index}
        value={referendum}
      />
    ));
  }
}

export default withMulti(
  Referendums,
  translate,
  withCall('query.democracy.nextTally'),
  withCall('query.democracy.referendumCount'),
  withCall('derive.democracy.referendums')
);
