// Copyright 2017-2018 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { ReferendumInfo } from '@polkadot/types';
import { withMulti, withObservable } from '@polkadot/ui-react-rx/with/index';

import Referendum from './Referendum';
import translate from './translate';

type Props = I18nProps & {
  democracyNextTally?: BN,
  referendums?: Array<ReferendumInfo>,
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

    console.error('democracyNextTally', democracyNextTally.toString(), referendums, referendumCount.toString());

    if (!referendums || !referendums.length || referendumCount.toNumber() === democracyNextTally.toNumber()) {
      return (
        <div className='ui disabled'>
          {t('proposals.none', {
            defaultValue: 'no available referendums'
          })}
        </div>
      );
    }

    return referendums.map((referendum, index) => (
      <Referendum
        idNumber={index}
        key={index}
        value={referendum}
      />
    ));
  }
}

export default withMulti(
  Referendums,
  translate,
  withObservable('referendums'),
  withObservable('referendumCount'),
  withObservable('democracyNextTally')
);
