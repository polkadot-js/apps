// Copyright 2017-2018 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { RxReferendum } from '@polkadot/api-observable/classes';

import BN from 'bn.js';
import React from 'react';
import withObservable from '@polkadot/ui-react-rx/with/observable';
import withMulti from '@polkadot/ui-react-rx/with/multi';

import Referendum from './Referendum';
import translate from './translate';

type Props = I18nProps & {
  democracyNextTally?: BN,
  referendums?: Array<RxReferendum>,
  referendumCount?: BN
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
    const { democracyNextTally = new BN(0), referendums, referendumCount = new BN(0), t } = this.props;

    if (!referendums || !referendums.length || referendumCount.toNumber() === democracyNextTally.toNumber()) {
      return (
        <div className='ui disabled'>
          {t('proposals.none', {
            defaultValue: 'no available referendums'
          })}
        </div>
      );
    }

    return referendums.map((referendum) => (
      <Referendum
        idNumber={referendum.id}
        key={referendum.id.toString()}
        value={referendum}
      />
    ));
  }
}

export default withMulti(
  translate(Referendums),
  withObservable('referendums'),
  withObservable('referendumCount'),
  withObservable('democracyNextTally')
);
