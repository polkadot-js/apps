// Copyright 2017-2018 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import classes from '@polkadot/ui-app/util/classes';
import withObservable from '@polkadot/ui-react-rx/with/observable';
import withMulti from '@polkadot/ui-react-rx/with/multi';

import Referendum from './Referendum';
import translate from './translate';

type Props = I18nProps & {
  democracyReferendumsActive?: Array<any>
};

class Referendums extends React.PureComponent<Props> {
  render () {
    const { className, style, t } = this.props;

    return (
      <div
        className={classes('democracy--Referendums', className)}
        style={style}
      >
        <h1>{t('referendums.header', {
          defaultValue: 'Active referendums'
        })}</h1>
        {this.renderReferendums()}
      </div>
    );
  }

  private renderReferendums () {
    const { democracyReferendumsActive, t } = this.props;
    const referendums = !democracyReferendumsActive || !democracyReferendumsActive.length
      ? []
      : democracyReferendumsActive.filter((referendum) =>
        Array.isArray(referendum) && referendum[0]
      );

    if (!referendums.length) {
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
        key={referendum[0].toNumber()}
        value={referendum}
      />
    ));
  }
}

export default withMulti(
  Referendums,
  translate,
  withObservable('democracyReferendumsActive')
);
