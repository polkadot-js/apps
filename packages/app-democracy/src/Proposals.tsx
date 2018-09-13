// Copyright 2017-2018 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { RxProposal } from '@polkadot/ui-react-rx/ApiObservable/types';

import React from 'react';
import withObservable from '@polkadot/ui-react-rx/with/observable';
import withMulti from '@polkadot/ui-react-rx/with/multi';

import Proposal from './Proposal';
import translate from './translate';

type Props = I18nProps & {
  democracyProposals?: Array<RxProposal>
};

class Proposals extends React.PureComponent<Props> {
  render () {
    const { t } = this.props;

    return (
      <section className='democracy--Proposals'>
        <h1>{t('proposals.header', {
          defaultValue: 'proposals'
        })}</h1>
        {this.renderProposals()}
      </section>
    );
  }

  private renderProposals () {
    const { democracyProposals, t } = this.props;

    if (!democracyProposals || !democracyProposals.length) {
      return (
        <div className='ui disabled'>
          {t('proposals.none', {
            defaultValue: 'no available proposals'
          })}
        </div>
      );
    }

    return democracyProposals.map((proposal) => (
      <Proposal
        idNumber={proposal.id}
        key={proposal.id.toString()}
        value={proposal}
      />
    ));
  }
}

export default withMulti(
  Proposals,
  translate,
  withObservable('democracyProposals')
);
