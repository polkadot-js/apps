// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ProposalIndex } from '@polkadot/types';

import BN from 'bn.js';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { withCalls, withMulti } from '@polkadot/ui-api';
import { Column } from '@polkadot/ui-app';

import Proposal from './Proposal';
import translate from '../translate';

type Props = I18nProps & RouteComponentProps & {
  isApprovals?: boolean;
  treasury_approvals?: BN[];
  treasury_proposalCount?: BN;
};

interface State {
  isEmpty: boolean;
  isProposeOpen: boolean;
  proposalIndices: BN[];
}

class ProposalsBase extends React.PureComponent<Props> {
  public state: State = {
    isEmpty: true,
    isProposeOpen: false,
    proposalIndices: [] as BN[]
  };

  static getDerivedStateFromProps ({ isApprovals = false, treasury_approvals = [] as BN[], treasury_proposalCount = new BN(0) }: Props) {
    let proposalIndices: BN[] = [];

    if (isApprovals) {
      proposalIndices = treasury_approvals;
    } else {
      for (let i = 0; i < treasury_proposalCount.toNumber(); i++) {
        if (!treasury_approvals.find(index => index.eqn(i))) {
          proposalIndices.push(new BN(i));
        }
      }
    }
    return { proposalIndices };
  }

  public render (): React.ReactNode {
    const { isApprovals, t } = this.props;
    const { isEmpty } = this.state;

    return (
      <>
        <Column
          emptyText={t(isApprovals ? 'No approved proposals' : 'No pending proposals')}
          headerText={t(isApprovals ? 'Approved' : 'Proposals')}
          isEmpty={isEmpty}
        >
          {this.renderProposals()}
        </Column>
      </>
    );
  }

  private renderProposals () {
    const { isApprovals } = this.props;
    const { proposalIndices } = this.state;

    return proposalIndices.map((proposalId) => (
      <Proposal
        isApproved={isApprovals}
        onPopulate={this.onPopulateProposal}
        onRespond={this.onRespond}
        proposalId={proposalId.toString()}
        key={proposalId.toString()}
      />
    ));
  }

  onRespond = () => {
    const { history } = this.props;

    history.push('/council/motions');
  }

  private onPopulateProposal = () => {
    this.setState(({ isEmpty }: State) => {
      if (isEmpty) {
        return { isEmpty: false };
      }
      return null;
    });
  }
}

const Proposals = withMulti(
  ProposalsBase,
  translate,
  withCalls<Props>(
    [
      'query.treasury.approvals',
      {
        transform: (value: ProposalIndex[]): BN[] =>
          value.map((proposalId): BN => new BN(proposalId))
      }
    ],
    'query.treasury.proposalCount'
  ),
  withRouter
);

export default Proposals;
export const Approvals = () => <Proposals isApprovals />;
