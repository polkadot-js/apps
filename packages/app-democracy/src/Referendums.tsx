// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { ReferendumInfoExtended } from '@polkadot/api-derive/democracy/referendumInfo';
import { Option } from '@polkadot/types';
import { withCalls } from '@polkadot/ui-api';

import Referendum from './Referendum';
import translate from './translate';

type Props = I18nProps & {
  democracy_nextTally?: BN,
  democracy_referendumCount?: BN,
  democracy_referendums?: Array<Option<ReferendumInfoExtended>>
};

class Referendums extends React.PureComponent<Props> {
  render () {
    const { t } = this.props;

    return (
      <section className='democracy--Referendums'>
        <h1>{t('referendums')}</h1>
        {this.renderReferendums()}
      </section>
    );
  }

  private renderReferendums () {
    const { democracy_nextTally, democracy_referendums, democracy_referendumCount, t } = this.props;
    const referendumCount = (democracy_referendumCount || new BN(0)).toNumber();

    if (!democracy_referendums || !democracy_referendums.length || (referendumCount === (democracy_nextTally || new BN(0)).toNumber())) {
      return (
        <div className='ui disabled'>
          {t('no available referendums')}
        </div>
      );
    }

    return democracy_referendums
      .filter((opt) => opt.isSome)
      .map((opt) => opt.unwrap())
      .map((referendum) => (
        <Referendum
          idNumber={referendum.index}
          key={referendum.index.toString()}
          value={referendum}
        />
      ));
  }
}

export default translate(
  withCalls<Props>(
    'query.democracy.nextTally',
    'query.democracy.referendumCount',
    'derive.democracy.referendums'
  )(Referendums)
);
