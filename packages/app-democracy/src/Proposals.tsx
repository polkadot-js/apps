// Copyright 2017-2018 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { RxProposal } from '@polkadot/api-observable/classes';

import React from 'react';
import { withMulti, withObservable } from '@polkadot/ui-react-rx/with/index';

import Proposal from './Proposal';
import translate from './translate';

type Props = I18nProps & {
  publicProposals?: Array<RxProposal>
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
    const { publicProposals, t } = this.props;

    if (!publicProposals || !publicProposals.length) {
      return (
        <div className='ui disabled'>
          {t('proposals.none', {
            defaultValue: 'no available proposals'
          })}
        </div>
      );
    }

    return publicProposals.map((proposal) => (
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
  withObservable('publicProposals')
);
