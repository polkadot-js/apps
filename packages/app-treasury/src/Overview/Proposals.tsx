// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ProposalIndex } from '@polkadot/types';

import BN from 'bn.js';
import React from 'react';
import { withCalls, withMulti } from '@polkadot/ui-api';
import { FilterOverlay, Dropdown } from '@polkadot/ui-app';

import Proposal from './Proposal';
import translate from '../translate';

type Props = I18nProps & {
  treasury_approvals?: Array<BN>,
  treasury_proposalCount?: BN
};

type State = {
  filter: 'pending' | 'approved',
  isProposeOpen: boolean,
  proposalIndices: Array<BN>
};

class Proposals extends React.PureComponent<Props> {
  filterOptions = [
    { text: 'Show pending spend proposals', value: 'pending' },
    { text: 'Show approved spend proposals', value: 'approved' }
  ];

  state: State = {
    isProposeOpen: false,
    proposalIndices: [] as Array<BN>,
    filter: 'pending'
  };

  static getDerivedStateFromProps ({ treasury_approvals = [] as Array<BN>, treasury_proposalCount = new BN(0) }: Props, { filter }: State) {
    let proposalIndices: Array<BN> = [];

    switch (filter) {
      case 'approved':
        proposalIndices = treasury_approvals;
        break;
      case 'pending':
      default:
        for (let i = 0; i < treasury_proposalCount.toNumber(); i++) {
          proposalIndices.push(new BN(i));
        }
    }
    return { proposalIndices };
  }

  render () {
    const { t } = this.props;
    const { filter } = this.state;

    return (
      <section className='democracy--Proposals'>
        <FilterOverlay>
          <Dropdown
            help={t('Select which validators/intentions you want to display.')}
            label={t('filter')}
            onChange={this.onChangeFilter}
            options={this.filterOptions.map(option => ({ ...option, text: t(option.text) }))}
            value={filter}
          />
        </FilterOverlay>
        <h1>
          {t('proposals')}
        </h1>
        {this.renderProposals()}
      </section>
    );
  }

  private renderProposals () {
    const { t } = this.props;
    const { filter, proposalIndices } = this.state;

    if (proposalIndices.length === 0) {
      return (
        <div className='ui disabled'>
          {t('no available proposals')}
        </div>
      );
    }
    return proposalIndices.map((proposalIndex) => (
      <Proposal
        isApproved={filter === 'approved'}
        proposalIndex={proposalIndex.toString()}
        key={proposalIndex.toString()}
      />
    ));
  }

  private onChangeFilter = (filter: 'pending' | 'approved') => {
    this.setState({ filter });
  }
}

export default withMulti(
  Proposals,
  translate,
  withCalls<Props>(
    [
      'query.treasury.approvals',
      {
        transform: (value: Array<ProposalIndex>) => value.map((proposalIndex) => new BN(proposalIndex))
      }
    ],
    'query.treasury.proposalCount'
  )
);
