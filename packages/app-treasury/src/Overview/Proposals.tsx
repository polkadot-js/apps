// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ProposalIndex } from '@polkadot/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { withCalls, withMulti } from '@polkadot/ui-api';
import { Button, CardGrid, FilterOverlay, Dropdown } from '@polkadot/ui-app';

import Proposal from './Proposal';
import Propose from './Propose';
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
    const { filter, isProposeOpen } = this.state;

    return (
      <>
      <FilterOverlay>
        <Dropdown
          help={t('Select which validators/intentions you want to display.')}
          label={t('filter')}
          onChange={this.onChangeFilter}
          options={this.filterOptions.map(option => ({ ...option, text: t(option.text) }))}
          value={filter}
        />
      </FilterOverlay>
      <CardGrid
        emptyText={t('No contracts available')}
        headerText={t('Proposals')}
        buttons={
          <Button.Group>
            <Button
              isPrimary
              label={t('Submit a spend proposal')}
              labelIcon='add'
              onClick={this.togglePropose(true)}
            />
          </Button.Group>
        }
      >
        {this.renderProposals()}
      </CardGrid>
      <Propose
        isOpen={isProposeOpen}
        onClose={this.togglePropose(false)}
      />
      </>
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
    return proposalIndices.map((proposalId) => (
      <Proposal
        isApproved={filter === 'approved'}
        proposalId={proposalId.toString()}
        key={proposalId.toString()}
      />
    ));
  }

  private onChangeFilter = (filter: 'pending' | 'approved') => {
    this.setState({ filter });
  }

  private togglePropose = (isProposeOpen: boolean) => () => {
    this.setState({
      isProposeOpen
    });
  }
}

export default withMulti(
  styled(Proposals as React.ComponentClass<Props, State>)`
    .treasury--Proposals-inner {
      display: flex;
      flex-wrap: column;
    }
  `,
  translate,
  withCalls<Props>(
    [
      'query.treasury.approvals',
      {
        transform: (value: Array<ProposalIndex>) => value.map((proposalId) => new BN(proposalId))
      }
    ],
    'query.treasury.proposalCount'
  )
);
